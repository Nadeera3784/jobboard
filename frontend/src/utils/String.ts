export function getInitials(name: string): string {
    const words: string[] = name.split(' ');
    let initials: string = '';
    for (const word of words) {
        initials += word[0];
    }
    return initials;
}

export function limitString(input: string, maxLength: number): string {
    if (input.length <= maxLength) {
        return input;
    } else {
        return input.slice(0, maxLength) + '...';
    }
}

export function removeHtmlTags(input: string): string {
    return input.replace(/<[^>]*>/g, '');
}