import {Module, Provider} from '@nestjs/common';

const providers = Array<Provider>().concat();

@Module({
  imports: [],
  providers,
  exports: providers,
})
export class CommonModule {}
