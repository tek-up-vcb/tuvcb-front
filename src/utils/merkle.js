import { keccak256 } from 'js-sha3';

// Hash un objet étudiant (nom, prenom, studentId) au format JSON avec keccak256
export function hashStudent(student) {
  const json = JSON.stringify({
    nom: student.nom,
    prenom: student.prenom,
    studentId: student.studentId,
  });
  return keccak256(json);
}

// Construit le Merkle tree (keccak256, format json) et retourne root, feuilles, proofs
export function computeMerkleTree(students) {
  if (!students || students.length === 0) {
    return { root: '', leaves: [], proofs: [] };
  }
  // 1. Feuilles : hash(nom,prenom,studentId)
  const leaves = students.map(hashStudent);
  // 2. Merkle tree (keccak256)
  let level = [...leaves];
  const tree = [level];
  while (level.length > 1) {
    const next = [];
    for (let i = 0; i < level.length; i += 2) {
      if (i + 1 < level.length) {
  next.push(keccak256(level[i] + level[i + 1]));
      } else {
        next.push(level[i]);
      }
    }
    tree.push(next);
    level = next;
  }
  // 3. Proofs (liste d'objets { hash, position } à chaque niveau)
  const proofs = leaves.map((_, idx) => {
    let proof = [];
    let index = idx;
    for (let l = 0; l < tree.length - 1; l++) {
      const level = tree[l];
      const sibling = index ^ 1;
      if (sibling < level.length) {
        const position = (index % 2 === 0) ? 'right' : 'left';
        proof.push({
          hash: level[sibling],
          position,
        });
      }
      index = Math.floor(index / 2);
    }
    return proof;
  });
  return {
    root: tree[tree.length - 1][0],
    leaves,
    proofs,
  };
}
