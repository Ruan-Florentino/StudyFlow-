/**
 * Estações de áudio para salas de estudo (streams públicos).
 * URLs podem mudar no ar; se uma falhar, o aluno troca de estação no player.
 */

export type SalaStationMood = 'lofi' | 'ambiente' | 'ritmo' | 'jazz';

export interface SalaAudioStation {
  id: string;
  label: string;
  mood: SalaStationMood;
  /** Descrição curta para UI */
  tagline: string;
  url: string;
}

export const SALA_STATION_MOOD_LABEL: Record<SalaStationMood, string> = {
  lofi: 'Lofi & beats',
  ambiente: 'Ambiente',
  ritmo: 'Ritmo / eletrônico',
  jazz: 'Jazz & lounge',
};

const LOCAL_SALA_STATION_COUNT = 6;

export const SALA_AUDIO_STATIONS: SalaAudioStation[] = [
  {
    id: 'local-lofi-chuva',
    label: 'Lofi Chuva',
    mood: 'lofi',
    tagline: 'Stream confiável com CORS aberto',
    url: 'https://ice6.somafm.com/groovesalad-128-mp3',
  },
  {
    id: 'local-biblioteca',
    label: 'Biblioteca Antiga',
    mood: 'ambiente',
    tagline: 'Ambiente estável para foco',
    url: 'https://ice6.somafm.com/lush-128-mp3',
  },
  {
    id: 'local-floresta',
    label: 'Floresta Viva',
    mood: 'ambiente',
    tagline: 'Pads etéreos para natureza interior',
    url: 'https://ice6.somafm.com/deepspaceone-128-mp3',
  },
  {
    id: 'local-cyberpunk',
    label: 'Cyberpunk Café',
    mood: 'ritmo',
    tagline: 'Synth para sessões longas',
    url: 'https://ice6.somafm.com/defcon-128-mp3',
  },
  {
    id: 'local-lareira',
    label: 'Lareira de Inverno',
    mood: 'ambiente',
    tagline: 'Texturas etéreas para leitura leve',
    url: 'https://ice6.somafm.com/groovesalad-128-mp3',
  },
  {
    id: 'local-cosmico',
    label: 'Vazio Cósmico',
    mood: 'ambiente',
    tagline: 'Ambiente espacial para foco profundo',
    url: 'https://ice6.somafm.com/deepspaceone-128-mp3',
  },
  {
    id: 'zeno-desk',
    label: 'Lofi Desk',
    mood: 'lofi',
    tagline: 'Beats calmos para leitura',
    url: 'https://stream.zeno.fm/0r0xa792kwzuv',
  },
  {
    id: 'zeno-chill',
    label: 'Chill Corner',
    mood: 'lofi',
    tagline: 'Hip hop instrumental suave',
    url: 'https://stream.zeno.fm/f3wvbbqmdg8uv',
  },
  {
    id: 'zeno-study',
    label: 'Study Haze',
    mood: 'lofi',
    tagline: 'Camada sonora contínua',
    url: 'https://stream.zeno.fm/fyn8eh3h5f8uv',
  },
  {
    id: 'zeno-hiphop-inst',
    label: 'Instrumental 24/7',
    mood: 'lofi',
    tagline: 'Lofi hip hop stream',
    url: 'https://stream.zeno.fm/hqbrk7skwxhvv',
  },
  {
    id: 'somafm-groove',
    label: 'Groove Salad',
    mood: 'ambiente',
    tagline: 'Downtempo e texturas',
    url: 'https://ice6.somafm.com/groovesalad-128-mp3',
  },
  {
    id: 'somafm-deep',
    label: 'Deep Space One',
    mood: 'ambiente',
    tagline: 'Ambiente espacial, foco profundo',
    url: 'https://ice6.somafm.com/deepspaceone-128-mp3',
  },
  {
    id: 'somafm-lush',
    label: 'Lush',
    mood: 'ambiente',
    tagline: 'Pads etéreos',
    url: 'https://ice6.somafm.com/lush-128-mp3',
  },
  {
    id: 'somafm-beat',
    label: 'Beat Blender',
    mood: 'ritmo',
    tagline: 'House & breaks leves',
    url: 'https://ice6.somafm.com/beatblender-128-mp3',
  },
  {
    id: 'somafm-defcon',
    label: 'DEF CON Radio',
    mood: 'ritmo',
    tagline: 'Synth / cyberpunk leve',
    url: 'https://ice6.somafm.com/defcon-128-mp3',
  },
  {
    id: 'somafm-sonic',
    label: 'Sonic Universe',
    mood: 'jazz',
    tagline: 'Jazz contemporâneo',
    url: 'https://ice6.somafm.com/sonicuniverse-128-mp3',
  },
  {
    id: 'somafm-illstreet',
    label: 'Illinois Street Lounge',
    mood: 'jazz',
    tagline: 'Lounge retrô',
    url: 'https://ice6.somafm.com/illstreet-128-mp3',
  },
  {
    id: 'somafm-poptron',
    label: 'PopTron',
    mood: 'ritmo',
    tagline: 'Electropop instrumental',
    url: 'https://ice6.somafm.com/poptron-128-mp3',
  },
];

export function salaStationsByMood(): Record<SalaStationMood, SalaAudioStation[]> {
  const acc: Record<SalaStationMood, SalaAudioStation[]> = {
    lofi: [],
    ambiente: [],
    ritmo: [],
    jazz: [],
  };
  for (const s of SALA_AUDIO_STATIONS) {
    acc[s.mood].push(s);
  }
  return acc;
}

/** Índice estável por matéria para cada sala começar com estação diferente */
export function defaultStationIndexForSubject(subjectId: string): number {
  let h = 0;
  for (let i = 0; i < subjectId.length; i++) {
    h = (h + subjectId.charCodeAt(i) * (i + 1)) % LOCAL_SALA_STATION_COUNT;
  }
  return h;
}

export function stationById(id: string): SalaAudioStation | undefined {
  return SALA_AUDIO_STATIONS.find((s) => s.id === id);
}
