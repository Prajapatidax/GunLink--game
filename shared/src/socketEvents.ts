export const SOCKET_EVENTS = {
  // Room Management
  ROOM_CREATE: 'room:create',
  ROOM_CREATED: 'room:created',
  ROOM_JOIN: 'room:join',
  ROOM_JOINED: 'room:joined',
  ROOM_ERROR: 'room:error',
  
  // Connection state
  PLAYER_CONNECTED: 'player:connected',
  PLAYER_DISCONNECTED: 'player:disconnected',
  CONTROLLER_CONNECTED: 'controller:connected',
  DISPLAY_CONNECTED: 'display:connected',
  
  // Real-time Motion & Game Controls
  ORIENTATION_UPDATE: 'controller:orientation',
  TRIGGER_PULL: 'controller:trigger',
  RELOAD: 'controller:reload',
  RECENTER: 'controller:recenter',
  SENSITIVITY_UPDATE: 'controller:sensitivity',

  // Game Loop & Synced Events
  GAME_START: 'game:start',
  GAME_RESTART: 'game:restart',
  GAME_OVER: 'game:over',
  GAME_STATE_UPDATE: 'game:state_update',
  
  // Combat & Scoring
  HIT_TARGET: 'combat:hit',
  SCORE_UPDATE: 'combat:score',
  COMBO_UPDATE: 'combat:combo',
  WEAPON_STATUS: 'combat:weapon_status',
  
  // Diagnostics
  PING: 'system:ping',
  PONG: 'system:pong'
} as const;

export type SocketEventName = typeof SOCKET_EVENTS[keyof typeof SOCKET_EVENTS];
