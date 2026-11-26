from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os

os.chdir(Path(__file__).parent)

class SiteHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split('?', 1)[0]
        if path.startswith('/assets/') or path in ('/style.css', '/app.js', '/favicon.ico', '/favicon.svg'):
            return super().do_GET()
        self.path = '/index.html'
        return super().do_GET()

if __name__ == '__main__':
    print('Creator House: http://localhost:8000')
    ThreadingHTTPServer(('localhost', 8000), SiteHandler).serve_forever()
