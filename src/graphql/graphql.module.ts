import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PubSub } from 'graphql-subscriptions';
import { Context } from 'graphql-ws';

const pubSub = new PubSub();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false, // Disable the default playground
      autoSchemaFile: 'schema.gql',
      subscriptions: {
        'graphql-ws': {
          onConnect: (context: Context<any>) => {
            const { connectionParams, extra } = context;
            Logger.log('Client connected for subscriptions');
            if (connectionParams.Authorization) {
              Logger.log(
                'Authorization header:',
                connectionParams.Authorization,
              );
              // Store the authorization token in the extra field
              (extra as { authorization?: string }).authorization = connectionParams.Authorization;
            } else {
              Logger.warn('No authorization header provided');
            }
          },
          onDisconnect: (context: Context<any>) => {
            Logger.log('Client disconnected from subscriptions');
          },
        },
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()], // Use only this plugin for the landing page
      context: ({ req, connection }) => {
        if (connection) {
          // Extract the authorization token from the extra field
          const authorization = connection.extra.authorization;
          return { req, pubSub, authorization };
        }
        return { req, pubSub };
      },
    }),
    AuthModule,
    UsersModule,
  ],
})
export class GraphqlModule {}
