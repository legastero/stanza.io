import expect from 'expect';
import * as JXT from '../src/jxt';

import { getHostMeta } from '../src/plugins/hostmeta';
import XRD from '../src/protocol';

const registry = new JXT.Registry();
registry.define(XRD);

const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0"' +
    '     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
    '  <Subject>http://blog.example.com/article/id/314</Subject>' +
    '  <Link rel="author" type="text/html"' +
    '        href="http://blog.example.com/author/steve" />' +
    '  <Link rel="author" href="http://example.com/author/john" />' +
    '</XRD>';

const json = {
    links: [
        {
            href: 'http://blog.example.com/author/steve',
            rel: 'author',
            type: 'text/html'
        },
        {
            href: 'http://example.com/author/john',
            rel: 'author'
        }
    ],
    subject: 'http://blog.example.com/article/id/314'
};

test('XRD', () => {
    expect.assertions(2);

    const xrd = registry.import(JXT.parse(xml))!;

    expect(xrd.subject).toBe(json.subject);
    expect(xrd.links).toEqual(json.links);
});

test('retrieve JSON only', done => {
    expect.assertions(2);

    getHostMeta(registry, {
        host: 'lance.im',
        json: true,
        xrd: false
    }).then(hostmeta => {
        expect(hostmeta.links).toBeTruthy();
        expect(hostmeta.links!.length > 0).toBeTruthy();
        done();
    });
});

test('retrieve XRD only', done => {
    expect.assertions(2);

    getHostMeta(registry, {
        host: 'lance.im',
        json: false,
        xrd: true
    }).then(hostmeta => {
        expect(hostmeta.links).toBeTruthy();
        expect(hostmeta.links!.length > 0).toBeTruthy();
        done();
    });
});

test('retrieve either', done => {
    expect.assertions(2);
    getHostMeta(registry, 'lance.im').then(hostmeta => {
        expect(hostmeta.links).toBeTruthy();
        expect(hostmeta.links!.length > 0).toBeTruthy();
        done();
    });
});

test('missing host-meta', done => {
    expect.assertions(1);
    getHostMeta(registry, {
        host: 'dne.lance.im',
        json: true,
        xrd: true
    }).catch(err => {
        expect(err).toBeTruthy();
        done();
    });
});
