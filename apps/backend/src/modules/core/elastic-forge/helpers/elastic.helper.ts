import { isEmail } from 'class-validator';

export class ElasticHelper {
  static escapeWildcard(term: string): string {
    const regex = /([\+\-\=\!\(\)\{\}\[\]\^\"\~\*\?\:\/]|(\|\|)|(&&)|(\\\\))/g;
    return term.replace(regex, '\\$1').replace(/[<>]/g, '');
  }

  static generateQueryString(inputTerm: string, useAsterisk = true): string {
    return inputTerm
      .split(' ')
      .filter((s) => !!s && s.trim())
      .map((term) => {
        if (isEmail(term)) {
          return term;
        }

        const splitted = term
          .replace(/-/g, ' ')
          .split(' ')
          .map((s) => this.escapeWildcard(s));

        if (useAsterisk) {
          return splitted.map((s) => `*${s}*`).join(' ');
        }

        return splitted.join(' ');
      })
      .join(' ');
  }
}
