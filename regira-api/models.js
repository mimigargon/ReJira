const Sequelize = require("sequelize");

const bcrypt = require("bcrypt");

const sequelize = new Sequelize("regira", "root", "admin", {
    host: "localhost",
    port: 3306,
    dialect: "mysql"
});

const Task = sequelize.define('task', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: true
    },
    priority: {
        type: Sequelize.ENUM('high', 'medium', 'low'),
        allowNull: false
    },
    state: {
        type: Sequelize.ENUM('backlog', 'ready', 'in_progress', 'review', 'testing', 'done'),
        allowNull: false
    },
    task_type: {
        type: Sequelize.ENUM('story', 'bugs', 'general'),
        allowNull: false
    }

})


const Project = sequelize.define('project', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})

const Comments = sequelize.define('comments', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: false
    }
})

const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


User.beforeCreate(async (user) => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
})


User.hasMany(Task);
Task.belongsTo(User);

Task.hasMany(Comments);
Comments.belongsTo(Task);

User.hasMany(Comments);
Comments.belongsTo(User);

Project.hasMany(Task);
Task.belongsTo(Project);

async function iniDB() {
    await sequelize.sync({ force: true });
}

//iniDB();

module.exports = {
    User,
    Task,
    Comments,
    Project
};