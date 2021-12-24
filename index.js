const db=require("./db/connection")
const inquirer=require("inquirer")

async function init (){
   const data=await inquirer.prompt(
        {
            type:"list",
            name:"choice",
            message:"What would you like to do?",
            choices:["view all departments","view all roles","view all employees","add a department","add a role","add an employee","update an employee role"]
        }
    )
    // .then((data) =>{
    //     console.log(data)
        switch(data.choice){
            case "view all departments":
                viewAllDepartments()
                break
            case "view all roles":
                viewAllRoles()
                break
            case "view all employees":
                viewAllEmployees()
                break
            case "add a department":
                addADepartment()
                break
            case"add a role":
                addARole()
                break
            case"add an employee":
            addAnEmployee()
                break
            case"update an employee role":
            updateAnEmployeeRole()
            break
            default:
            break

        }

        
        
    // })
}
function viewAllDepartments(){
    const sql="SELECT * FROM department"
    db.query(sql, (err,result)=>{
        if(err)throw err
        console.table(result)
        init()
    }) 
}
function viewAllRoles(){
    const sql="SELECT * FROM role"
    db.query(sql, (err,result)=>{
        if(err)throw err
        console.table(result)
        init()
    })   
}
function viewAllEmployees(){
    const sql=`SELECT employee.id,employee.first_name,employee.last_name,CONCAT(manager.first_name,' ',manager.last_name) AS manager,role.salary,role.title,department.name AS department
 FROM  employee
 LEFT JOIN role
 ON employee.role_id=role.id
 LEFT JOIN department
 ON role.department_id=department.id
 LEFT JOIN employee manager
 ON employee.manager_id=manager.id`
 db.query(sql, (err,result)=>{
    if(err)throw err
    console.table(result)
    init()
})   
}
async function addADepartment(){
   const {name}=await inquirer.prompt({
        name:"name",
        message:"What is the name of the department?"

    }) 
    const sql="INSERT INTO department (name) VALUES (?)"
    db.query(sql,name, (err,result)=>{
        if(err)throw err
        console.log(`${name} added`)
        init()
    })      
}
async function addARole(){
    const sql="SELECT * FROM department"
    db.query(sql, (err,result)=>{
        if(err)throw err
        
        const departmentChoice=result.map(({id,name})=>({
            name:name,
            value:id
        }))
       inquirer.prompt([
            {
                name:"title",
                message:"What is name of the role?"
            },

            {
                name:"salary",
                message:"What is the salary?"

            },
            {
                type:"list",
                name:"department_id",
                message:"What is the department?",
                choices:departmentChoice
            }
        ])
        .then(data =>{
            const params=[data.title,data.salary,data.department_id]
            const sql="INSERT INTO role (title,salary,department_id) VALUES (?,?,?)"
            db.query(sql,params, (err,result)=>{
                if(err)throw err
                console.log(`${data.title} added`)
                init()
            })      
        })
    })      
}
async function addAnEmployee(){
const  roleArray=await findRole()
const managerArray=await findManager()
const roleChoice=roleArray.map(({id,title})=>({
    name:title,
    value:id
}))
const managerChoice=managerArray.map(({id,first_name,last_name})=>({
    name:first_name+" "+last_name,
    value:id
}))

inquirer.prompt([
    {
     name:"first_name",
     message:"What is the employee first name"  
    },
    {
        name:"last_name",
        message:"What is the employee last name"  
       },
    {
        type:"list",
        name:"manager",
        message:"Who is the manager",
        choices:managerChoice
    },
    {
        type:"list",
        name:"role",
        message:"What is the role?",
        choices:roleChoice
    }
    
])
.then(data=>{
    
    const sql="INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)"
    const params=[data.first_name,data.last_name,data.role,data.manager]
    db.query(sql,params, (err,result)=>{
        if(err)throw err
        console.log(`${data.first_name} added`)
        init()
    })      
})
}
function findRole(){
    return new Promise(resolve =>{
        const sql="SELECT * FROM role"
        db.query(sql, (err,result)=>{
            if(err)throw err
           resolve(result)
        })      
    })
}
function findManager(){
    return new Promise(resolve =>{
    const sql="SELECT * FROM employee"
    db.query(sql, (err,result)=>{
        if(err)throw err
       resolve(result)
    }) 
})     
}
// function findManager(){
//     return new Promise(resolve =>{
//  const sql="SELECT CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON employee.manager_id=manager.id"       
// let manager=[]
// let map={}
// db.query(sql, (err,result)=>{
//     if(err)throw err
//     for (let managerObj of result){
//         if (managerObj.manager !==null){
//             map[managerObj.manager=true]
//         }
//     }
//     for(let key in map){
//         manager.push(key)
//     }
//    resolve(manager)
// })      
// })
// }
async function updateAnEmployeeRole(){
    const  roleArray=await findRole()
    const employeeArray=await findManager()
    const roleChoice=roleArray.map(({id,title})=>({
        name:title,
        value:id
    }))
    const employeeChoice=employeeArray.map(({id,first_name,last_name})=>({
        name:first_name+" "+last_name,
        value:id
    }))  
    inquirer.prompt([
        {
            type:"list", 
            name:"employee",
            message:"Which employee would like to update?",
            choices:employeeChoice,
        },
        {
            type:"list", 
            name:"role",
            message:"What is the employee new role?",
            choices:roleChoice,
        },
    ])
    .then(data =>{
        // console.log(data.employee)
        // let firstName=data.employee
        // firstName=firstName.split(/(\s+)/)
        // firstName=firstName[0]
        const sql="UPDATE employee SET role_id = ? WHERE id = ?"
        const params=[data.role,data.employee]
        db.query(sql,params, (err,result)=>{
            if(err)throw err
            // console.log(`${data.firstName} added`)
            init()
        })      
    })  
}
async function start(){
    await init()
}
start()