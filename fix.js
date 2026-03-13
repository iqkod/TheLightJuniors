const fs = require('fs');
let content = fs.readFileSync('grandfinale.html', 'utf8');

// The replacement logic
const oldLogic = `                // Firestore batch limit is 500. For small quizzes, one batch is usually enough.
                const batches = [];
                let currentBatch = writeBatch(db);
                let count = 0;

                allResultsData.forEach((res) => {
                    const ref = doc(db, "artifacts", appId, "public", "data", "quizLSO_results", res.id);
                    currentBatch.delete(ref);
                    count++;
                    
                    if (count === 490) {
                        batches.push(currentBatch.commit());
                        currentBatch = writeBatch(db);
                        count = 0;
                    }
                });
                
                if (count > 0) {
                    batches.push(currentBatch.commit());
                }

                await Promise.all(batches);`;

const newLogic = `                // We must first update all documents with the admin_secret so that the delete rule passes
                const updateBatches = [];
                let uBatch = writeBatch(db);
                let uCount = 0;

                allResultsData.forEach((res) => {
                    const ref = doc(db, "artifacts", appId, "public", "data", "quizLSO_results", res.id);
                    uBatch.update(ref, { admin_secret: ADMIN_SECRET });
                    uCount++;
                    
                    if (uCount === 490) {
                        updateBatches.push(uBatch.commit());
                        uBatch = writeBatch(db);
                        uCount = 0;
                    }
                });
                
                if (uCount > 0) {
                    updateBatches.push(uBatch.commit());
                }

                await Promise.all(updateBatches);

                // Now that they have the secret, we can delete them
                const deleteBatches = [];
                let dBatch = writeBatch(db);
                let dCount = 0;

                allResultsData.forEach((res) => {
                    const ref = doc(db, "artifacts", appId, "public", "data", "quizLSO_results", res.id);
                    dBatch.delete(ref);
                    dCount++;
                    
                    if (dCount === 490) {
                        deleteBatches.push(dBatch.commit());
                        dBatch = writeBatch(db);
                        dCount = 0;
                    }
                });
                
                if (dCount > 0) {
                    deleteBatches.push(dBatch.commit());
                }

                await Promise.all(deleteBatches);`;

// Normalize line endings to avoid issues
const normalize = str => str.replace(/\r\n/g, '\n');

if (normalize(content).includes(normalize(oldLogic))) {
    content = normalize(content).replace(normalize(oldLogic), newLogic);
    fs.writeFileSync('grandfinale.html', content);
    console.log("Replacement successful!");
} else {
    console.log("OLD LOGIC NOT FOUND! Please check the exact string.");
}
