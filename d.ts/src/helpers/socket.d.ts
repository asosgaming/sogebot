import type { AlertInterface } from '@entity/alert';
import type { BetsInterface } from '@entity/bets';
import type { ChecklistInterface } from '@entity/checklist';
import type { CommandsCountInterface, CommandsInterface } from '@entity/commands';
import type { CooldownInterface } from '@entity/cooldown';
import type { EventInterface } from '@entity/event';
import type { EventListInterface } from '@entity/eventList';
import type { GalleryInterface } from '@entity/gallery';
import type { HighlightInterface } from '@entity/highlight';
import type { HowLongToBeatGameInterface, HowLongToBeatGameItemInterface } from '@entity/howLongToBeatGame';
import type { KeywordInterface } from '@entity/keyword';
import type { OverlayMapperMarathon } from '@entity/overlay';
import type { PermissionsInterface } from '@entity/permissions';
import type { PollInterface } from '@entity/poll';
import type { PriceInterface } from '@entity/price';
import type { QueueInterface } from '@entity/queue';
import type { QuotesInterface } from '@entity/quotes';
import type { RaffleInterface } from '@entity/raffle';
import type { RankInterface } from '@entity/rank';
import type { currentSongType, SongBanInterface, SongPlaylistInterface } from '@entity/song';
import type { SpotifySongBanInterface } from '@entity/spotify';
import type { TextInterface } from '@entity/text';
import type { TimerInterface } from '@entity/timer';
import type {
  UserBitInterface, UserInterface, UserTipInterface,
} from '@entity/user';
import type { VariableInterface, VariableWatchInterface } from '@entity/variable';
import { HelixVideo } from '@twurple/api/lib';
import { Socket } from 'socket.io';
import { FindConditions } from 'typeorm';

type Configuration = {
  [x:string]: Configuration | string;
};

export type possibleLists = 'systems' | 'core' | 'integrations' | 'overlays' | 'games' | 'services';
export interface getListOfReturn {
  systems: {
    name: string; enabled: boolean; areDependenciesEnabled: boolean; isDisabledByEnv: boolean;
  }[];
  services: { name: string }[];
  core: { name: string }[];
  integrations: {
    name: string; enabled: boolean; areDependenciesEnabled: boolean; isDisabledByEnv: boolean;
  }[];
  overlays: {
    name: string; enabled: boolean; areDependenciesEnabled: boolean; isDisabledByEnv: boolean;
  }[];
  games: {
    name: string; enabled: boolean; areDependenciesEnabled: boolean; isDisabledByEnv: boolean;
  }[];
}

type GenericEvents = {
  'settings': (cb: (error: Error | string | null, settings: Record<string, any>, ui: Record<string, any>) => void) => void,
  'settings.update': (opts: Record<string,any>, cb: (error: Error | string | null) => void) => void,
  'settings.refresh': () => void,
  'set.value': (opts: { variable: string, value: any }, cb: (error: Error | string | null, opts: { variable: string, value: any } | null) => void) => void,
  'get.value': (variable: string, cb: (error: Error | string | null, value: any) => void) => void,
};

type generic<T> = {
  getAll: (cb: (error: Error | string | null, items: Readonly<Required<T>>[]) => void) => void,
  getOne: (id: Required<T['id']>, cb: (error: Error | string | null, item?: Readonly<Required<T>>) => void) => void,
  setById: (opts: { id: Required<T['id']>, item: Partial<T> }, cb: (error: Error | string | null, item?: Readonly<Required<T>> | null) => void) => void,
  deleteById: (id: Required<T['id']>, cb: (error: Error | string | null) => void) => void;
};

export type ClientToServerEventsWithNamespace = {
  '/core/emotes': GenericEvents & {
    'testExplosion': (cb: (err: Error | string | null, data: null ) => void) => void,
    'testFireworks': (cb: (err: Error | string | null, data: null ) => void) => void,
    'test': (cb: (err: Error | string | null, data: null ) => void) => void,
    'removeCache': (cb: (err: Error | string | null, data: null ) => void) => void,
  },
  '/integrations/discord': GenericEvents & {
    'discord::getRoles': (cb: (err: Error | string | null, data: { text: string, value: string}[] ) => void) => void,
    'discord::getGuilds': (cb: (err: Error | string | null, data: { text: string, value: string}[] ) => void) => void,
    'discord::getChannels': (cb: (err: Error | string | null, data: { text: string, value: string}[] ) => void) => void,
    'discord::authorize': (cb: (err: Error | string | null, action?: null | { do: 'redirect', opts: any[] } ) => void) => void,
  },
  '/integrations/donationalerts': GenericEvents & {
    'donationalerts::validate': (token: string, cb: (err: Error | string | null) => void) => void,
  },
  '/integrations/pubg': GenericEvents & {
    'pubg::searchForseasonId': (data: { apiKey: string, platform: string }, cb: (err: Error | string | null, data: null | { data: any[] }) => void) => void,
    'pubg::searchForPlayerId': (data: { apiKey: string, platform: string, playerName: string }, cb: (err: Error | string | null, data: null | any) => void) => void,
    'pubg::getUserStats': (data: { apiKey: string, platform: string, playerId: string, seasonId: string, ranked: boolean}, cb: (err: Error | string | null, data: null | any) => void) => void,
    'pubg::exampleParse': (data: { text: string}, cb: (err: Error | string | null, data: string | null) => void) => void,
  },
  '/integrations/spotify': GenericEvents & {
    'spotify::revoke': (cb: (err: Error | string | null, opts?: { do: 'refresh' }) => void) => void,
    'spotify::authorize': (cb: (err: Error | string | null, action?: null | { do: 'redirect', opts: any[] }) => void) => void,
    'spotify::state': (cb: (err: Error | string | null, state: string) => void) => void,
    'spotify::code': (token: string, cb: (err: Error | string | null, state: boolean) => void) => void,
    'spotify::skip': (cb: (err: Error | string | null) => void) => void,
    'spotify::addBan': (spotifyUri: string, cb?: (err: Error | string | null) => void) => void,
    'spotify::deleteBan': (where: FindConditions<SpotifySongBanInterface>, cb?: (err: Error | string | null) => void) => void,
    'spotify::getAllBanned': (where: FindConditions<SpotifySongBanInterface>, cb?: (err: Error | string | null, items: SpotifySongBanInterface[]) => void) => void,
  },
  '/overlays/eventlist': GenericEvents & {
    'eventlist::getUserEvents': (userId: string, cb: (err: Error | string | null, events: EventListInterface[]) => void) => void,
  },
  '/overlays/gallery': GenericEvents & {
    'generic::getOne': generic<GalleryInterface>['getOne'],
    'generic::getAll': generic<GalleryInterface>['getAll'],
    'generic::deleteById': generic<GalleryInterface>['deleteById'],
    'generic::setById': generic<GalleryInterface>['setById'],
    'gallery::upload': (data: [filename: string, data: { id: string, b64data: string, folder?: string }], cb: (err: Error | string | null, item?: OverlayMapperMarathon) => void) => void,
  },
  '/overlays/marathon': GenericEvents & {
    'marathon::check': (id: string, cb: (err: Error | string | null, item?: OverlayMapperMarathon) => void) => void,
    'marathon::update::set': (data: { time: number, id: string }) => void,
  },
  '/overlays/countdown': GenericEvents & {
    'countdown::check': (id: string, cb: (err: Error | string | null, update?: {
      timestamp: number;
      isEnabled: boolean;
      time: number;
    }) => void) => void,
    'countdown::update::set': (data: { id: string, isEnabled: boolean | null, time: number | null }) => void,
  },
  '/overlays/stopwatch': GenericEvents & {
    'stopwatch::check': (id: string, cb: (err: Error | string | null, update?: {
      timestamp: number;
      isEnabled: boolean;
      time: number;
    }) => void) => void,
    'stopwatch::update::set': (data: { id: string, isEnabled: boolean | null, time: number | null }) => void,
  },
  '/registries/alerts': GenericEvents & {
    'isAlertUpdated': (data: { updatedAt: number; id: string }, cb: (err: Error | null, isUpdated: boolean, updatedAt: number) => void) => void,
    'alerts::save': (item: Required<AlertInterface>, cb: (error: Error | string | null, item: null | Required<AlertInterface>) => void) => void,
    'alerts::delete': (item: Required<AlertInterface>, cb: (error: Error | string | null) => void) => void,
  },
  '/registries/randomizer': GenericEvents & {
    'randomizer::startSpin': () => void,
    'randomizer::showById': (id: string, cb: (error: Error | string | null) => void) => void,
  },
  '/core/permissions': GenericEvents & {
    'generic::deleteById': generic<PermissionsInterface>['deleteById'],
    'permission::save': (data: Required<PermissionsInterface>[], cb?: (error: Error | string | null) => void) => void,
    'test.user': (opts: { pid: string, value: string, state: string }, cb: (error: Error | string | null, response?: { status: import('../helpers/permissions/check').checkReturnType | { access: 2 }, partial: import('../helpers/permissions/check').checkReturnType | { access: 2 }, state: string }) => void) => void,
  },
  '/registries/text': GenericEvents & {
    'text::save': (item: TextInterface, cb: (error: Error | string | null, item: TextInterface | null) => void) => void,
    'text::remove': (item: TextInterface, cb: (error: Error | string | null) => void) => void,
    'text::presets': (_: unknown, cb: (error: Error | string | null, folders: string[] | null) => void) => void,
    'generic::getAll': generic<TextInterface>['getAll'],
    'generic::getOne': (opts: { id: string, parseText: boolean }, cb: (error: Error | string | null, item: TextInterface) => void) => void,
  },
  '/services/twitch': GenericEvents & {
    'eventsub::reset': () => void,
    'broadcaster': (cb: (error: Error | string | null, username: string) => void) => void,
  },
  '/core/socket': GenericEvents & {
    'purgeAllConnections': (cb: (error: Error | string | null) => void, socket?: Socket) => void,
  },
  '/': GenericEvents & {
    'leaveBot': () => void,
    'joinBot': () => void,
    'responses.get': (_: null, cb: (data: { default: string; current: string }) => void) => void,
    'responses.set': (data: { name: string, value: string }) => void,
    'responses.revert': (data: { name: string }, cb: () => void) => void,
    'api.stats': (data: { code: number, remaining: number | string, data: string}) => void,
    'translations': (cb: (lang: Record<string, any>) => void) => void,
    'panel::resetStatsState': () => void,
    'version': (cb: (version: string) => void) => void,
    'debug::get': (cb: (error: Error | string | null, debug: string) => void) => void,
    'debug::set': (debug: string, cb: (error: Error | string | null) => void) => void,
    'panel::alerts': (cb: (error: Error | string | null, data: { errors: import('./panel/alerts').UIError[], warns: import('./panel/alerts').UIError[] }) => void) => void,
    'getLatestStats': (cb: (error: Error | string | null, stats: Record<string, any>) => void) => void,
    'populateListOf':<list extends possibleLists> (type: list, cb: (error: Error | string | null, data: getListOfReturn[list]) => void) => void,
  },
  '/stats/commandcount': GenericEvents & {
    'commands::count': (cb: (error: Error | string | null, items: CommandsCountInterface[]) => void) => void,
  },
  '/stats/profiler': GenericEvents & {
    'profiler::load': (cb: (error: Error | string | null, items: [string, number[]][]) => void) => void,
  },
  '/stats/bits': GenericEvents & {
    'generic::getAll': generic<UserBitInterface & { username: string }>['getAll'],
  },
  '/stats/tips': GenericEvents & {
    'generic::getAll': generic<UserTipInterface & { username: string }>['getAll'],
  },
  '/systems/bets': GenericEvents & {
    'bets::getCurrentBet': (cb: (error: Error | string | null, item?: BetsInterface) => void) => void,
    'bets::close': (option: 'refund' | string) => void,
  },
  '/systems/commercial': GenericEvents & {
    'commercial.run': (data: { seconds: string }) => void,
  },
  '/systems/highlights': GenericEvents & {
    'highlight': () => void,
    'generic::getAll': (cb: (error: Error | string | null, highlights: Readonly<Required<HighlightInterface>>[], videos: HelixVideo[]) => void) => void,
    'generic::deleteById': generic<HighlightInterface>['deleteById'],
  },
  '/systems/howlongtobeat': GenericEvents & {
    'generic::getAll': (cb: (error: Error | string | null, item: Readonly<Required<HowLongToBeatGameInterface>>[], gameItem: Readonly<Required<HowLongToBeatGameItemInterface>>[]) => void) => void,
    'hltb::save': (item: HowLongToBeatGameInterface, cb: (error: Error | string | null, item?: HowLongToBeatGameInterface) => void) => void,
    'hltb::addNewGame': (game: string, cb: (error: Error | string | null) => void) => void,
    'hltb::getGamesFromHLTB': (game: string, cb: (error: Error | string | null, games: string[]) => void) => void,
    'hltb::saveStreamChange': (stream: HowLongToBeatGameItemInterface, cb: (error: Error | string | null, stream?: HowLongToBeatGameItemInterface) => void) => void,
    'generic::deleteById': generic<HowLongToBeatGameInterface>['deleteById'],
  },
  '/systems/checklist': GenericEvents & {
    'generic::getAll': (cb: (error: Error | string | null, array: any[], items: Readonly<Required<ChecklistInterface>>[]) => void) => void,
    'checklist::save': (item: ChecklistInterface, cb: (error: Error | string | null) => void) => void,
  },
  '/games/seppuku': GenericEvents,
  '/games/heist': GenericEvents,
  '/games/fightme': GenericEvents,
  '/games/duel': GenericEvents,
  '/games/roulette': GenericEvents,
  '/games/gamble': GenericEvents,
  '/core/dashboard': GenericEvents,
  '/core/currency': GenericEvents,
  '/systems/userinfo': GenericEvents,
  '/systems/scrim': GenericEvents,
  '/systems/emotescombo': GenericEvents,
  '/systems/antihateraid': GenericEvents,
  '/services/google': GenericEvents,
  '/integrations/twitter': GenericEvents,
  '/integrations/tipeeestream': GenericEvents,
  '/integrations/streamlabs': GenericEvents,
  '/integrations/streamelements': GenericEvents,
  '/integrations/qiwi': GenericEvents,
  '/integrations/obswebsocket': GenericEvents,
  '/integrations/lastfm': GenericEvents,
  '/integrations/phillipshue': GenericEvents,
  '/systems/cooldown': GenericEvents & {
    'generic::getAll': generic<CooldownInterface>['getAll'],
    'generic::getOne': (id: string, cb: (error: Error | string | null, item?: Readonly<Required<CooldownInterface>> | null, count?: number) => void) => void,
    'generic::deleteById': generic<CooldownInterface>['deleteById'],
    'cooldown::save': (item: CooldownInterface, cb: (error: Error | string | null, item?: CooldownInterface) => void) => void,
  },
  '/systems/customcommands': GenericEvents & {
    'commands::resetCountByCommand': (command: string, cb: (error: Error | string | null) => void) => void,
    'generic::getAll': (cb: (error: Error | string | null, items: Readonly<Required<CommandsInterface>>[], count: { command: string; count: number; }[] | null) => void) => void,
    'generic::getOne': (id: string, cb: (error: Error | string | null, item?: Readonly<Required<CommandsInterface>> | null, count?: number) => void) => void,
    'generic::deleteById': generic<CommandsInterface>['deleteById'],
    'generic::setById': generic<CommandsInterface>['setById'],
  },
  '/systems/keywords': GenericEvents & {
    'generic::getAll': generic<KeywordInterface>['getAll'],
    'generic::getOne': generic<KeywordInterface>['getOne'],
    'generic::deleteById': generic<KeywordInterface>['deleteById'],
    'generic::setById': generic<KeywordInterface>['setById'],
  },
  '/systems/levels': GenericEvents & {
    'getLevelsExample': (cb: (error: Error | string | null, levels: string[]) => void) => void,
  },
  '/systems/moderation': GenericEvents & {
    'lists.get': (cb: (error: Error | string | null, lists: { blacklist: string[], whitelist: string[] }) => void) => void,
    'lists.set': (lists: { blacklist: string[], whitelist: string[] }) => void,
  },
  '/systems/points': GenericEvents & {
    'parseCron': (cron: string, cb: (error: Error | string | null, intervals: number[]) => void) => void,
    'reset': () => void,
  },
  '/systems/queue': GenericEvents & {
    'queue::getAllPicked': (cb: (error: Error | string | null, items: QueueInterface[]) => void) => void,
    'queue::pick': (data: { username?: string | string[], random: boolean, count: number; }, cb: (error: Error | string | null, items: QueueInterface[]) => void) => void,
    'queue::clear': (cb: (error: Error | string | null) => void) => void,
    'generic::getAll': generic<QueueInterface>['getAll'],
  },
  '/systems/quotes': GenericEvents & {
    'generic::getOne': generic<QuotesInterface>['getOne'],
    'generic::setById': generic<QuotesInterface>['setById'],
    'generic::deleteById': generic<QuotesInterface>['deleteById'],
    'quotes:getAll': (_: unknown, cb: (error: Error | string | null, items: QuotesInterface[]) => void) => void,
  },
  '/systems/raffles': GenericEvents & {
    'raffle::getWinner': (name: string, cb: (error: Error | string | null, item?: UserInterface) => void) => void,
    'raffle::setEligibility': (opts: {id: string, isEligible: boolean}, cb: (error: Error | string | null) => void) => void,
    'raffle:getLatest': (cb: (error: Error | string | null, item?: RaffleInterface) => void) => void,
    'raffle::pick': () => void,
    'raffle::close': () => void,
    'raffle::open': (message: string) => void,
  },
  '/systems/polls': GenericEvents & {
    'generic::getAll': generic<PollInterface>['getAll'],
    'generic::getOne': generic<PollInterface>['getOne'],
    'generic::deleteById': generic<PollInterface>['deleteById'],
    'polls::save': (item: PollInterface, cb: (error: Error | string | null) => void) => void,
    'polls::close': (item: PollInterface, cb: (error: Error | string | null) => void) => void,
  },
  '/systems/price': GenericEvents & {
    'generic::getAll': generic<PriceInterface>['getAll'],
    'generic::getOne': generic<PriceInterface>['getOne'],
    'generic::deleteById': generic<PriceInterface>['deleteById'],
    'price::save': (item: PriceInterface, cb: (error: Error | string | null) => void) => void,
  },
  '/systems/ranks': GenericEvents & {
    'generic::getAll': generic<RankInterface>['getAll'],
    'generic::getOne': generic<RankInterface>['getOne'],
    'ranks::remove': (id: string, cb?: (error: Error | string | null) => void) => void,
    'ranks::save': (item: RankInterface, cb: (error: Error | string | null, item: RankInterface) => void) => void,
  },
  '/systems/songs': GenericEvents & {
    'isPlaying': (cb: (isPlaying: boolean) => void) => void,
    'songs::getAllRequests': (_: any, cb: (error: Error | string | null, requests: SongRequestInterface[]) => void) => void,
    'current.playlist.tag': (cb: (error: Error | string | null, tag: string) => void) => void,
    'find.playlist': (opts: { page: number, search: string, tag: string | null, perPage: number}, cb: (error: Error | string | null, songs: SongPlaylistInterface[], count: number) => void) => void,
    'songs::currentSong': (cb: (error: Error | string | null, song: currentSongType) => void) => void,
    'set.playlist.tag': (tag: string) => void,
    'get.playlist.tags': (cb: (error: Error | string | null, tags: string[]) => void) => void,
    'songs::save': (item: SongPlaylistInterface, cb: (error: Error | string | null, item: SongPlaylistInterface) => void) => void,
    'songs::getAllBanned': (where: Record<string, any> | null | undefined, cb: (error: Error | string | null, item: SongBanInterface[]) => void) => void,
    'songs::removeRequest': (id: string, cb: (error: Error | string | null) => void) => void,
    'delete.playlist': (id: string, cb: (error: Error | string | null) => void) => void,
    'delete.ban': (id: string, cb: (error: Error | string | null) => void) => void,
    'import.ban': (url: string, cb: (error: Error | string | null, result: import('../parser').CommandResponse[]) => void) => void,
    'import.playlist': (opts: { playlist: string, forcedTag: string | null }, cb: (error: Error | string | null, result: import('../parser').CommandResponse[] | null) => void) => void,
    'import.video': (opts: { playlist: string, forcedTag: string | null }, cb: (error: Error | string | null, result: import('../parser').CommandResponse[] | null) => void) => void,
    'stop.import': () => void,
    'next': () => void,
  },
  '/systems/timers': GenericEvents & {
    'generic::getAll': (cb: (error: Error | string | null, timers: Readonly<Required<TimerInterface>>[]) => void) => void,
    'generic::getOne': (id: string, cb: (error: Error | string | null, timer?: Readonly<Required<TimerInterface>>) => void) => void,
    'generic::setById': generic<TimerInterface>['setById'],
    'generic::deleteById': generic<TimerInterface>['deleteById'],
  },
  '/widgets/joinpart': GenericEvents & {
    'joinpart': (data: { users: string[], type: 'join' | 'part' }) => void,
    'viewers': (cb: (error: Error | string | null, data: { chatters: any }) => void) => void,
  },
  '/widgets/chat': GenericEvents & {
    'room': (cb: (error: Error | string | null, room: string) => void) => void,
    'chat.message.send': (message: string) => void,
    'viewers': (cb: (error: Error | string | null, data: { chatters: any }) => void) => void,
  },
  '/widgets/customvariables': GenericEvents & {
    'watched::save': (items: VariableWatchInterface[], cb: (error: Error | string | null, variables: VariableWatchInterface[]) => void) => void,
    'customvariables::list': (cb: (error: Error | string | null, variables: VariableInterface[]) => void) => void,
    'list.watch': (cb: (error: Error | string | null, variables: VariableWatchInterface[]) => void) => void,
    'watched::setValue': (opts: { id: string, value: string | number }, cb: (error: Error | string | null) => void) => void,
  },
  '/widgets/eventlist': GenericEvents & {
    'eventlist::removeById': (idList: string[] | string, cb: (error: Error | string | null) => void) => void,
    'eventlist::get': (count: number) => void,
    'skip': () => void,
    'cleanup': () => void,
    'askForGet': (cb: () => void) => void,
    'update': (cb: (values: any) => void) => void,
    'eventlist::resend': (id: string) => void,
  },
  '/core/events': GenericEvents & {
    'events::getRedeemedRewards': (cb: (error: Error | string | null, rewards: string[]) => void) => void,
    'generic::getAll': (cb: (error: Error | string | null, data: EventInterface[]) => void) => void,
    'generic::getOne': (id: string, cb: (error: Error | string | null, data?: EventInterface) => void) => void,
    'list.supported.events': (cb: (error: Error | string | null, data: any[] /* TODO: missing type */) => void) => void,
    'list.supported.operations': (cb: (error: Error | string | null, data: any[] /* TODO: missing type */) => void) => void,
    'test.event': (opts: { id: string; randomized: string[], variables: string[], values: any[] }, cb: (error: Error | string | null) => void) => void,
    'events::save': (event: EventInterface, cb: (error: Error | string | null, data: EventInterface) => void) => void,
    'events::remove': (eventId: Required<EventInterface['id']>, cb: (error: Error | string | null) => void) => void,
  },
  '/core/tts': GenericEvents & {
    'google::speak': (opts: { volume: number; pitch: number; rate: number; text: string; voice: string; }, cb: (error: Error | string | null, audioContent?: string | null) => void) => void,
  },
  '/core/ui': GenericEvents & {
    'configuration': (cb: (error: Error | string | null, data?: Configuration) => void) => void,
  },
  '/core/updater': GenericEvents & {
    'updater::check': (cb: (error: Error | string | null) => void) => void,
    'updater::trigger': (opts: { pkg: string, version: string }, cb?: (error: Error | string | null) => void) => void,
  },
  '/core/users': GenericEvents & {
    'viewers::resetPointsAll': (cb?: (error: Error | string | null) => void) => void,
    'viewers::resetMessagesAll': (cb?: (error: Error | string | null) => void) => void,
    'viewers::resetWatchedTimeAll': (cb?: (error: Error | string | null) => void) => void,
    'viewers::resetSubgiftsAll': (cb?: (error: Error | string | null) => void) => void,
    'viewers::resetBitsAll': (cb?: (error: Error | string | null) => void) => void,
    'viewers::resetTipsAll': (cb?: (error: Error | string | null) => void) => void,
    'viewers::update': (data: [userId: string, update: Partial<UserInterface> & { tips?: UserTipInterface[], bits?: UserBitInterface[] }], cb: (error: Error | string | null) => void) => void,
    'viewers::findOne': (userId: string, cb: (error: Error | string | null, viewer: UserInterface & { tips: UserTipInterface[], bits: UserBitInterface[], aggregatedTips: number; aggregatedBits: number; permission: PermissionsInterface }) => void) => void,
    'viewers::remove': (userId: string, cb: (error: Error | string | null) => void) => void,
    'getNameById': (id: string, cb: (error: Error | string | null, user: string | null) => void) => void,
    'viewers::followedAt': (id: string, cb: (error: Error | string | null, followedAtDate: string | null) => void) => void,
    'find.viewers': (opts: { state: string, page?: number; perPage?: number; order?: { orderBy: string, sortOrder: 'ASC' | 'DESC' }, filter?: { vips: boolean | null; subscribers: boolean | null; followers: boolean | null; active: boolean | null; }, search?: string, exactUsernameFromTwitch?: string }, cb: (error: Error | string | null, viewers: any[], count: number, state: string | null) => void) => void,
  },
  '/core/general': GenericEvents & {
    'generic::getCoreCommands': (cb: (error: Error | string | null, commands: import('../general').Command[]) => void) => void,
    'generic::setCoreCommand': (commands: import('../general').Command, cb: (error: Error | string | null) => void) => void,
  },
  '/core/customvariables': GenericEvents & {
    'customvariables::list': (cb: (error: Error | string | null, items: VariableInterface[]) => void) => void,
    'customvariables::runScript': (id: string, cb: (error: Error | string | null, items: VariableInterface | null) => void) => void,
    'customvariables::testScript': (opts: { evalValue: string, currentValue: string }, cb: (error: Error | string | null, returnedValue: any) => void) => void,
    'customvariables::isUnique': (opts: { variable: string, id: string }, cb: (error: Error | string | null, isUnique: boolean) => void) => void,
    'customvariables::delete': (id: string, cb?: (error: Error | string | null) => void) => void,
    'customvariables::save': (item: VariableInterface, cb: (error: Error | string | null, itemId: string | null) => void) => void,
  }
};

type Fn<Params extends readonly any[] = readonly any[], Result = any> =
  (...params: Params) => Result;

type NestedFnParams<
  O extends Record<PropertyKey, Record<PropertyKey, Fn>>,
  K0 extends keyof O,
  K1 extends keyof O[K0],
> = Parameters<O[K0][K1]>;