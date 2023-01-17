const fs = require('fs');
const qs = require("qs");
const handle = {};

handle.readFileSystem = async (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err.message)
            } else {
                resolve(data)
            }
        })
    })
}

handle.writeFileSystem = async (filename, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, err => {
            if (err) {
                reject(err.message)
            } else {
                resolve();
            }
        })
    })
}

handle.showHomePage = async (req, res) => {
    let dataHTML = await handle.readFileSystem('./views/home.html');
    res.write(dataHTML);
    res.end();
}

handle.showUserPage = async (req, res) => {
    let dataHTML = await handle.readFileSystem('./views/users/list.html');
    let data = await handle.readFileSystem('./data.json');
    let users = JSON.parse(data.toString());

    let newHTML = '';
    users.forEach((user, index) => {
        newHTML += `<tr>`;
        newHTML += `<td>${index + 1}</td>`;
        newHTML += `<td>${user.name}</td>`;
        newHTML += `<td>${user.email}</td>`;
        newHTML += `<td><div class="badge ${(user.role === '1') ? 'badge-primary' : 'badge-info'} text-wrap" style="width: 6rem;">
            ${(user.role === '1') ? 'student' : 'admin'}</div></td>`;
        newHTML += `<td><a onclick="return confirm('Are you sure you want to delete this user?')" href="/users/delete?id=${user.id}" class="btn btn-danger">Delete</a></td>`;
        newHTML += `</tr>`;
    })

    dataHTML = dataHTML.replace('{list-user}', newHTML)

    res.write(dataHTML);
    res.end();
}

handle.deleteUser = async (req, res, id) => {
    let data = await handle.readFileSystem('./data.json');
    let users = JSON.parse(data.toString());
    let index = -1;

    for (let i = 0; i < users.length; i++) {
        if (id == users[i].id) {
            index = i;
            break;
        }
    }

    if (index == -1) {
        res.writeHead(404, 'Not found')
        res.end();
    } else {
        users.splice(index, 1);
        await handle.writeFileSystem('./data.json', JSON.stringify(users));
        res.writeHead(301, {Location: '/users'})
        res.end();
    }
}

handle.showUserCreatePage = async (req, res) => {
    let dataHTML = await handle.readFileSystem('./views/users/create.html');
    res.write(dataHTML)
    res.end();
}

handle.addUser = async (req, res) => {
    //b1 Lay  du lieu tu req
    let dataForm = ''
    req.on('data', chunk => {
        dataForm += chunk
    });
    req.on('end', async () => {
        console.log(dataForm)
        let user = qs.parse(dataForm);
        let data = await handle.readFileSystem('./data.json');
        let users = JSON.parse(data.toString());
        users.push(user)
        await handle.writeFileSystem('./data.json', JSON.stringify(users));
        res.writeHead(301, {Location: '/users'})
        res.end();
    })
}

module.exports = handle