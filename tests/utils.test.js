const test = require('node:test');
const assert = require('node:assert/strict');

const { formatDate, getInitials } = require('../utils');

test('getInitials returns initials for a full name', () => {
  assert.equal(getInitials('Abhay Sharma'), 'AS');
});

test('getInitials returns initials for multiple words', () => {
  assert.equal(getInitials('Abhay Kumar Sharma'), 'AK');
});

test('getInitials handles empty values', () => {
  assert.equal(getInitials(''), '?');
  assert.equal(getInitials(null), '?');
});

test('formatDate returns dash for empty date', () => {
  assert.equal(formatDate(''), '—');
});

test('formatDate returns original value for invalid date', () => {
  assert.equal(formatDate('invalid-date'), 'invalid-date');
});

test('formatDate formats a valid date', () => {
  const result = formatDate('2026-09-10T00:00:00.000Z');

  assert.match(result, /10/);
  assert.match(result, /Sep/);
  assert.match(result, /2026/);
});