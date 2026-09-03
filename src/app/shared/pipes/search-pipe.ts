import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform<T extends object>(value: T[] | null | undefined, query: string | null | undefined): T[] {
    if (!value || !query?.trim()) {
      return value ?? [];
    }

    const normalizedQuery = query.trim().toLowerCase();

    return value.filter((item) =>
      Object.values(item).some((field) => String(field).toLowerCase().includes(normalizedQuery)),
    );
  }
}
