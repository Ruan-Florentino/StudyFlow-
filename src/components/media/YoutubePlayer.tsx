import { lazy } from 'react';
import { createReactPlayer } from 'react-player/ReactPlayer';
import { canPlay } from 'react-player/patterns';
import type { PlayerEntry } from 'react-player/players';

const YoutubeVideoPlayer = lazy(() => import('youtube-video-element/react'));

const youtubeOnlyPlayer: PlayerEntry = {
  key: 'youtube',
  name: 'YouTube',
  canPlay: canPlay.youtube,
  player: YoutubeVideoPlayer as unknown as PlayerEntry['player'],
};

const fallbackPlayer: PlayerEntry = {
  key: 'fallback',
  name: 'Fallback',
  canPlay: () => true,
};

const YoutubePlayer = createReactPlayer([youtubeOnlyPlayer], fallbackPlayer);

export default YoutubePlayer;
