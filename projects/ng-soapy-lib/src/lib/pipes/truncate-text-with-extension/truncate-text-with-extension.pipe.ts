import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateTextWithExtension'
})
export class TruncateTextWithExtensionPipe implements PipeTransform {
  transform(value: string, amount: number): unknown {
    // truncates long names to a specific length
    if (value.length > amount) {
      const regex = /(?:\.([^.]+))?$/;
      const extracted = regex.exec(value);
      if (extracted && extracted[1]) {
        return value.slice(0, amount) + '...' + extracted[1];
      } else return value;
    } else {
      return value;
    }
  }
}
