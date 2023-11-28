const { Pool } = require("pg");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsOnPlaylist(playlistId, userId) {
    const query = {
      text: `SELECT s.id, s.title, s.performer FROM songs AS s
      LEFT JOIN playlist_song_activities AS ps ON ps.song_id = s.id
      WHERE ps.playlist_id = $1 AND ps.user_id = $2
      GROUP BY s.id`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = SongsService;
