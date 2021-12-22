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
            // default:
            // break

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

async function start(){
    await init()
}
start()