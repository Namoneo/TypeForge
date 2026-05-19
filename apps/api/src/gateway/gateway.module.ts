import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeForgeGateway } from './typeforge.gateway';
import { CompilerModule } from '../compiler/compiler.module';

@Module({
  imports: [CompilerModule, JwtModule.register({})],
  providers: [TypeForgeGateway],
  exports: [TypeForgeGateway],
})
export class GatewayModule {}
