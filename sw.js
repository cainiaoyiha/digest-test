// sw.js - Service Worker 用于拦截请求并伪造响应头
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    // 只拦截包含 special-test 的请求
    if (!url.pathname.includes('/special-test')) return;

    const type = url.searchParams.get('type');
    const responseBody = "hello world";
    let headers = {
        'Content-Type': 'text/plain'
    };

    // 正确的哈希：hello world 的 sha256
    const correctDigest = 'sha-256=:uU0nuZNNPgilLlLX2n2r+sSE7+N6U4DukIj3rOLvzek=:';
    // 错误的哈希：空字符串的 sha256
    const wrongDigest   = 'sha-256=:2jmj7l5rSw0yVb/vlWAYkK/YBwk=:';

    if (type === 'unencoded-match') {
        headers['Unencoded-Digest'] = correctDigest;
    } else if (type === 'unencoded-mismatch') {
        headers['Unencoded-Digest'] = wrongDigest;
    } else if (type === 'identity-match') {
        headers['Identity-Digest'] = correctDigest;
    } else if (type === 'identity-mismatch') {
        headers['Identity-Digest'] = wrongDigest;
    } else if (type === 'none') {
        // 无头
    }

    event.respondWith(new Response(responseBody, { headers }));
});