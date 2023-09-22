import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'snakeToTitle'
})
export class SnakeToTitlePipe implements PipeTransform {
  transform(value: string): string {
    if (typeof value !== 'string' || !value) return 'N/A';
    if (!value.includes('-')) return value;
    return value
      .split('-')
      .map((word, index) => {
        if (index !== 0) return word;
        return word[0].toUpperCase() + word.slice(1);
      })
      .join(' ');
  }
}
