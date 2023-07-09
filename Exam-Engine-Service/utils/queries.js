exports.createExamDefintion = 'INSERT INTO examdefinition (name, questions) VALUES ($1, $2) RETURNING id';
exports.assignExam = 'INSERT INTO examinstance (examdefinition_id, generatedlink, createdBy, takenBy, examStatus, questions) VALUES ($1, $2, $3, $4, $5, $6)';
exports.getStudentExam = 'SELECT * FROM examinstance WHERE examdefinition_id=$1 AND takenBy=$2';
exports.updateStudentExamTaken = 'UPDATE examinstance SET startedTime=$1, examStatus=$2 WHERE id=$3';
exports.getStudentquestions = 'SELECT * FROM examdefinition WHERE id = $1';
exports.updateStudentExamSubmitted = 'UPDATE examinstance SET generatedlink=$1, endTime=$2, questions=$3, grade=$4 WHERE id=$5';
exports.getExamDefinitions = 'SELECT * FROM examdefinition';
exports.getExamInstances = 'SELECT * FROM examinstance WHERE takenBy=$1';
exports.getExamDefinitionById = 'SELECT * FROM examdefinition WHERE id = $1';