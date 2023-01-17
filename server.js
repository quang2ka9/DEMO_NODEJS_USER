const http = require('http');
const PORT = 8000;
const url = require('url');
const handle = require('./lib/handle');
const qs = require('qs');

const server = http.createServer(async (req, res)=>{
    const cUrl = url.parse(req.url);
    switch (cUrl.pathname) {
        case '/':
            handle.showHomePage(req, res).catch(err => {
                console.log(err.message);
            })
            break;
        case '/users':
            handle.showUserPage(req, res).catch(err => {
                console.log(err.message)
            })
            break;
        case '/users/delete':
            let id = qs.parse(cUrl.query).id;
            handle.deleteUser(req, res, id).catch(err => {
                console.log(err.message)
            })
            break;
        case '/users/create':
            if (req.method === 'GET') {
                handle.showUserCreatePage(req, res).catch(err => {
                    console.log(err.message)
                })
            } else  {
                handle.addUser(req, res).catch(err => {
                    console.log(err.message)
                })
            }
            break;

        default:
            res.end('oke');

    }

})

server.listen(PORT, 'localhost', () => {
    console.log('server listening on http://localhost:' + PORT)
})