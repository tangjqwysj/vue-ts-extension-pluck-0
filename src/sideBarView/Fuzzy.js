"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Fuzzy {
    /**
     * Searches for a given string in another string. The string does not
     * have to match exactlly, the method uses a "fuzzy matching".
     *
     * According to implementation of: https://github.com/bevacqua/fuzzysearch
     */
    static search(needle, haystack) {
        needle = needle.toLowerCase();
        haystack = haystack.toLowerCase();
        const hlen = haystack.length;
        const nlen = needle.length;
        if (nlen > hlen) {
            return false;
        }
        if (nlen === hlen) {
            return needle === haystack;
        }
        // outer: for (let i = 0, j = 0; i < nlen; i += 1) {
        //   const nch = needle.charCodeAt(i)
        //   while (j < hlen) {
        //     if (haystack.charCodeAt(j++) === nch) {
        //       continue outer
        //     }
        //   }
        //   return false
        // }
        // return true
        for (let i = 0; i < nlen; i++) {
            const nch = needle.charCodeAt(i);
            if (haystack.charCodeAt(i) !== nch) {
                return false;
            }
        }
        return true;
    }
}
exports.default = Fuzzy;
//# sourceMappingURL=Fuzzy.js.map