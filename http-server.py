from http.server import HTTPServer, SimpleHTTPRequestHandler


class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET. POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET. POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()
        super().end_headers()

if __name__ == '__main__':
    HTTP_PORT = 8080

    with HTTPServer(("", HTTP_PORT), CORSRequestHandler) as httpd:
        print(f"serving on port {HTTP_PORT} with CORS enabled")
        httpd.serve_forever()