import { Module } from '@nestjs/common';
import { TypeForgeGateway } from './typeforge.gateway';
import { CompilerModule } from '../compiler/compiler.module';

@Module({
  imports: [CompilerModule],
  providers: [TypeForgeGateway],
  exports: [TypeForgeGateway],
})
export class GatewayModule {}
