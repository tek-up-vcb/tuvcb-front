import { keccak256, toUtf8Bytes } from 'ethers';

export function computeDiplomaHashes(students, diplomaMeta) {
  // diplomaMeta peut contenir {diplomaId, name, level, field}
  return students.map(s => {
    const payload = JSON.stringify({
      studentId: s,
      diploma: diplomaMeta,
    });
    return keccak256(toUtf8Bytes(payload));
  });
}