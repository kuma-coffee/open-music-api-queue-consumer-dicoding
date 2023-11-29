const { Pool } = require("pg");

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async getSongsOnPlaylist(playlistId, userId) {
    const playlistQuery = {
      text: `SELECT p.id, p.name FROM playlists AS p 
      WHERE p.id = $1 AND p.owner = $2`,
      values: [playlistId, userId],
    };
    const playlistResult = await this._pool.query(playlistQuery);

    const playlistData = playlistResult.rows[0];

    const songsQuery = {
      text: `SELECT s.id, s.title, s.performer FROM songs AS s
      LEFT JOIN playlist_song_activities AS ps ON ps.song_id = s.id
      WHERE ps.playlist_id = $1 AND ps.user_id = $2
      GROUP BY s.id`,
      values: [playlistId, userId],
    };

    const songsResult = await this._pool.query(songsQuery);

    const songsData = songsResult.rows;

    return {
      playlist: {
        ...playlistData,
        songs: [...songsData],
      },
    };
  }
}

module.exports = SongsService;
