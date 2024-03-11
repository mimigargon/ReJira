const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const multer = require('multer');
const jwt = require('jsonwebtoken');

const SECRET_KEY = "nocilla-que-merendilla";

const { User, Task, Comments, Project } = require('./models');

const {
    createItem,
    updateItem,
    deleteItem,
    readItem,
    readItems
} = require('./generics');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../regira-front/public/img') // Especifica la carpeta de destinació dels fitxers pujats
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`) // Assigna un nom únic als fitxers pujats
    }
})

const upload = multer({ storage: storage }).single('foto')

const checkToken = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });

    }

    try {
        const decodedToken = jwt.verify(token, SECRET_KEY);
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

router.post('/comments', async (req, res) => await createItem(req, res, Comments));
router.get('/comments', async (req, res) => await readItems(req, res, Comments));
router.get('/comments/:id', async (req, res) => await readItem(req, res, Comments));
router.put('/comments/:id', async (req, res) => await updateItem(req, res, Comments));
router.delete('/comments/:id', async (req, res) => await deleteItem(req, res, Comments));

router.post('/project', async (req, res) => await createItem(req, res, Project));
router.get('/project', async (req, res) => await readItems(req, res, Project));
router.get('/project/:id', async (req, res) => await readItem(req, res, Project));
router.put('/project/:id', async (req, res) => await updateItem(req, res, Project));
router.delete('/project/:id', async (req, res) => await deleteItem(req, res, Project));

router.post('/task/project/:idProject', checkToken, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(500).json({ error: 'User not found' });
        }

        req.body.userId = req.userId;
        req.body.projectId = req.params.idProject;

        upload(req, res, async function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (req.file) {
                req.body.foto = req.file.filename;
            }

            const item = await user.createTask(req.body);
            res.status(201).json(item);
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/task', async (req, res) => await readItems(req, res, Task));
router.get('/task/:id', async (req, res) => await readItem(req, res, Task));
router.get('/task/project/:idProject', async (req, res) => {
    try {
        const project = await Project.findByPk(req.params.idProject);

        req.body.idProject = req.idProject;

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const tasks = await project.getTasks();
        res.json(tasks);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.patch('/task/:idTask', async (req, res) => {
    try {
        const existingTask = await Task.findByPk(req.params.idTask);

        if (!existingTask) {
            return res.status(400).json({ error: 'Task not found' });
        }

        if (req.body.name) {
            existingTask.name = req.body.name;
        }
        if (req.body.description) {
            existingTask.description = req.body.description;
        }
        if (req.body.priority) {
            existingTask.priority = req.body.priority;
        }
        if (req.body.state) {
            existingTask.state = req.body.state;
        }
        if (req.body.task_type) {
            existingTask.task_type = req.body.task_type;
        }

        await existingTask.save();

        return res.status(200).json({ message: 'Task updated' });
    } catch (error) {
        return res.status(500).json({ error: `Error updating task ${idTask}` });
    }
});

router.delete('/task/:id', async (req, res) => await updateItem(req, res, Task));


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log('login')
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }
        const token = jwt.sign({ userId: user.id, userName: user.name }, SECRET_KEY, { expiresIn: '2h' });
        res.cookie('token', token, { httpOnly: false, maxAge: 7200000 });
        res.json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/refresh', checkToken, async (req, res) => {
    const user = await User.findByPk(req.userId);
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ id: user.id, name: user.name })
})

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email and password are incorrect' });
        }
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/users', checkToken, async (req, res) => await readItems(req, res, User));
router.get('/user/:id', checkToken, async (req, res) => await readItem(req, res, User));
router.put('/user/:id', checkToken, async (req, res) => await updateItem(req, res, User));
router.delete('/user/:id', checkToken, async (req, res) => await deleteItem(req, res, User));


module.exports = router;