// src/mocks/backlogs.js

// Données en dur pour simuler la table `backlog`
export const MOCK_BACKLOGS = [
  {
    id: 1,
    user_id: 1,
    action_type: 'USER_CREATE',
    action_description: 'Création du user alice@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201, ip: '127.0.0.1', user_agent: 'Mock' },
    created_at: '2025-09-12T13:40:12.000Z',
  },
  {
    id: 2,
    user_id: 1,
    action_type: 'USER_ROLE_SET',
    action_description: 'Changement de rôle du user 1 en ADMIN par admin@tekup.tn',
    metadata: { path: '/users/1/roles', method: 'POST', status_code: 200, role: 'ADMIN' },
    created_at: '2025-09-12T13:40:30.000Z',
  },
  {
    id: 3,
    user_id: 2,
    action_type: 'USER_CREATE',
    action_description: 'Création du user bob@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:40:54.000Z',
  },
  {
    id: 4,
    user_id: 2,
    action_type: 'USER_UPDATE',
    action_description: 'Mise à jour du user 2 par admin@tekup.tn',
    metadata: { path: '/users/2', method: 'PATCH', status_code: 200, changes: { phone: '+216 55 555 555' } },
    created_at: '2025-09-12T13:41:07.000Z',
  },
  {
    id: 5,
    user_id: 3,
    action_type: 'USER_CREATE',
    action_description: 'Création du user charlie@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:41:36.000Z',
  },
  {
    id: 6,
    user_id: 3,
    action_type: 'USER_DELETE',
    action_description: 'Suppression du user 3 par admin@tekup.tn',
    metadata: { path: '/users/3', method: 'DELETE', status_code: 200 },
    created_at: '2025-09-12T13:41:54.000Z',
  },
  {
    id: 7,
    user_id: null,
    action_type: 'USER_CREATE',
    action_description: 'Création du user diana@example.com par anonyme',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:45:48.000Z',
  },
  {
    id: 8,
    user_id: 4,
    action_type: 'USER_UPDATE',
    action_description: 'Mise à jour du user 4 par admin@tekup.tn',
    metadata: { path: '/users/4', method: 'PATCH', status_code: 200, changes: { role: 'STUDENT' } },
    created_at: '2025-09-12T13:46:02.000Z',
  },
  {
    id: 9,
    user_id: 5,
    action_type: 'USER_CREATE',
    action_description: 'Création du user eva@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:46:14.000Z',
  },
  {
    id: 10,
    user_id: 5,
    action_type: 'USER_ROLE_SET',
    action_description: 'Changement de rôle du user 5 en TEACHER par admin@tekup.tn',
    metadata: { path: '/users/5/roles', method: 'POST', status_code: 200, role: 'TEACHER' },
    created_at: '2025-09-12T13:46:25.000Z',
  },
  {
    id: 11,
    user_id: 6,
    action_type: 'USER_CREATE',
    action_description: 'Création du user farah@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:46:51.000Z',
  },
  {
    id: 12,
    user_id: 6,
    action_type: 'USER_UPDATE',
    action_description: 'Mise à jour du user 6 par admin@tekup.tn',
    metadata: { path: '/users/6', method: 'PATCH', status_code: 200, changes: { address: 'Tunis' } },
    created_at: '2025-09-12T13:48:35.000Z',
  },
  {
    id: 13,
    user_id: 7,
    action_type: 'USER_CREATE',
    action_description: 'Création du user ghassen@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:48:50.000Z',
  },
  {
    id: 14,
    user_id: 7,
    action_type: 'USER_DELETE',
    action_description: 'Suppression du user 7 par admin@tekup.tn',
    metadata: { path: '/users/7', method: 'DELETE', status_code: 200 },
    created_at: '2025-09-12T13:49:04.000Z',
  },
  {
    id: 15,
    user_id: 8,
    action_type: 'USER_CREATE',
    action_description: 'Création du user hadi@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:49:35.000Z',
  },
  {
    id: 16,
    user_id: 8,
    action_type: 'USER_UPDATE',
    action_description: 'Mise à jour du user 8 par admin@tekup.tn',
    metadata: { path: '/users/8', method: 'PATCH', status_code: 200, changes: { phone: '+216 22 222 222' } },
    created_at: '2025-09-12T13:49:48.000Z',
  },
  {
    id: 17,
    user_id: 9,
    action_type: 'USER_CREATE',
    action_description: 'Création du user ines@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:49:59.000Z',
  },
  {
    id: 18,
    user_id: 10,
    action_type: 'USER_CREATE',
    action_description: 'Création du user sameh@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:52:36.000Z',
  },
  {
    id: 19,
    user_id: 10,
    action_type: 'USER_ROLE_SET',
    action_description: 'Changement de rôle du user 10 en STUDENT par admin@tekup.tn',
    metadata: { path: '/users/10/roles', method: 'POST', status_code: 200, role: 'STUDENT' },
    created_at: '2025-09-12T13:52:58.000Z',
  },
  {
    id: 20,
    user_id: 11,
    action_type: 'USER_CREATE',
    action_description: 'Création du user yassine@example.com par admin@tekup.tn',
    metadata: { path: '/users', method: 'POST', status_code: 201 },
    created_at: '2025-09-12T13:53:22.000Z',
  },
  {
    id: 21,
    user_id: 7,
    action_type: 'USER_DELETE',
    action_description: 'Suppression du user 11 par admin@tekup.tn',
    metadata: { path: '/users/11', method: 'DELETE', status_code: 200 },
    created_at: '2025-09-12T13:54:00.000Z',
  },
];

// Simule une API GET /backlogs avec pagination + filtres
export function mockFetchBacklogs({ limit = 20, offset = 0, userId, actionType } = {}) {
  let items = [...MOCK_BACKLOGS].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );
  if (userId !== undefined && userId !== null) {
    items = items.filter((it) => String(it.user_id) === String(userId));
  }
  if (actionType) {
    items = items.filter((it) => it.action_type === actionType);
  }
  const total = items.length;
  const page = items.slice(offset, offset + limit);

  // Simule une latence réseau
  return new Promise((resolve) => {
    setTimeout(() => resolve({ total, items: page }), 250);
  });
}
