import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: false, // Disable default playground
      autoSchemaFile: 'schema.gql',
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onConnect: (context: any) => {
            // Assuming JWT is passed as part of the connectionParams (from headers or WebSocket context)
            const token = context.connectionParams?.Authorization || '';
            if (!token) throw new Error('No token provided');
            return { token };
          },
        },
        'subscriptions-transport-ws': {
          path: '/graphql',
          onConnect: (connectionParams) => {
            // Handling legacy protocol
            return {
              req: {
                headers: { authorization: connectionParams.Authorization },
              },
            };
          },
        },
      },
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      formatError: (error) => {
        return {
          message: error.message,
          code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
        };
      },
      context: ({ req, connection }) => {
        if (connection) {
          return { ...connection.context, pubSub }; // Includes JWT token from onConnect
        }
        return { req, pubSub };
      },
    }),
    AuthModule,
    UsersModule,
  ],
})
export class GraphqlModule {}
