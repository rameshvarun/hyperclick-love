'use babel';
/* @flow */

import {Range, Point} from 'atom';
import shell from 'shell';

import fs from 'fs';
import path from 'path';

// These regexes match a valid identifier forwards and backwards.
const PREFIX_REGEX = /[a-zA-Z0-9][a-zA-Z0-9_\.]*$/;
const SUFFIX_REGEX = /^[a-zA-Z0-9_\.]*/;

// Load in data from rameshvarun/love-ide-data.
const DATA_FOLDER = path.join(__dirname, '..', 'node_modules', 'love-ide-data')
const CONFIG_API = JSON.parse(fs.readFileSync(path.join(DATA_FOLDER, 'config-api.json')).toString());
const API = JSON.parse(fs.readFileSync(path.join(DATA_FOLDER, 'api.json')).toString());

// Merge the normal api and the config api into one set of URL mappings.
var URLS = Object.assign({}, CONFIG_API, API);

export var provider: HyperclickProvider = {
  providerName: 'LOVE2D Hyperclick',
  getSuggestionForWord(editor: atom$TextEditor, query: string, range: atom$Range): ?HyperclickSuggestion  {
    // Extemd the range of the token backwards.
    var prefix = editor.getTextInBufferRange(new Range(new Point(range.start.row, 0), range.start));
    var prefixMatch = prefix.match(PREFIX_REGEX);
    if (prefixMatch) {
      query = prefixMatch[0] + query;
      range = new Range(new Point(range.start.row, range.start.column - prefixMatch[0].length), range.end);
    }

    // Extend the range of the token forwards.
    var suffix = editor.getTextInBufferRange(new Range(range.end, new Point(range.end.row, Number.MAX_SAFE_INTEGER)));
    var suffixMatch = suffix.match(SUFFIX_REGEX);
    if (suffixMatch) {
      query = query + suffixMatch[0];
      range = new Range(range.start, new Point(range.end.row, range.end.column + suffixMatch[0].length));
    }

    // If a mapping exists for this query, open the URL.
    if (URLS[query]) {
      return {
        range: range,
        callback() { shell.openExternal(URLS[query].url); },
      };
    } else {
      return null;
    }
	},
};
