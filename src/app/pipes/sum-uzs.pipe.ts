import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumUzs',
  standalone: false,
})
export class SumUzsPipe implements PipeTransform {
  transform(value: number | null | undefined, fractionDigits = 0): string {
    if (value == null || Number.isNaN(value)) {
      return '—';
    }
    return new Intl.NumberFormat('uz-UZ', {
      style: 'currency',
      currency: 'UZS',
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
    }).format(value);
  }
}
