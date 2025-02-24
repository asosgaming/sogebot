import { WidgetSocial, WidgetSocialInterface } from '@entity/widget';
import {
  Arg, Authorized, Query, Resolver,
} from 'type-graphql';
import { getRepository } from 'typeorm';

@Resolver()
export class WidgetSocialResolver {
  @Authorized()
  @Query(returns => [WidgetSocialInterface])
  widgeSocialGet(@Arg('page', { defaultValue: 0 }) page: number, @Arg('limit', { defaultValue: 100 }) limit: number) {
    return getRepository(WidgetSocial).find({
      order: { timestamp: 'DESC' },
      take:  limit,
      skip:  page * limit,
    });
  }
}