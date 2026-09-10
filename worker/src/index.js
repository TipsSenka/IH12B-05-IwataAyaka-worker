const jsonResponse = (data, status = 200, extraHeaders = {}) => {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      ...extraHeaders,
    },
  });
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    if (pathname === '/' || pathname === '/api') {
      return jsonResponse({
        message: 'Worker API is running.',
        endpoints: ['/api', '/api/course', '/api/hello?name=山田'],
      });
    }

    if (pathname === '/api/course') {
      return jsonResponse({
        course: {
          id: 1,
          title: 'Cloudflare Worker 入門',
          instructor: 'Iwata Ayaka',
          status: 'open',
        },
        courses: [
          { id: 1, title: 'Cloudflare Worker 入門', category: 'cloud' },
          { id: 2, title: 'Pages を使った静的公開', category: 'pages' },
          { id: 3, title: 'API 連携の基礎', category: 'api' },
        ],
      });
    }

    if (pathname === '/api/hello') {
      const name = url.searchParams.get('name');

      if (!name || !name.trim()) {
        return jsonResponse(
          {
            error: 'name is required',
            message: 'Please provide a name like ?name=山田',
          },
          400,
        );
      }

      return jsonResponse({
        message: `Hello, ${name}!`,
        name,
        timestamp: new Date().toISOString(),
      });
    }

    return jsonResponse(
      {
        error: 'Not Found',
        path: pathname,
      },
      404,
    );
  },
};
