import Stats from './_interface';

import { avgTime } from '~/helpers/profiler';
import { adminEndpoint } from '~/helpers/socket';

class Profiler extends Stats {
  constructor() {
    super();
    this.addMenu({
      category: 'stats', name: 'profiler', id: 'stats/profiler', this: null,
    });
  }
  public sockets() {
    adminEndpoint('/stats/profiler', 'profiler::load', async (cb) => {
      cb(null, Array.from(avgTime.entries()));
    });
  }
}

export default new Profiler();
