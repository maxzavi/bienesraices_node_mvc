const admin = (req,res)=>{
    res.render('properties/admin',{
        page:'Mis propiedades',
        bar: true
    });
}

const create = (req, res)=>{
    res.render('properties/create',{
        page:'Crear propiedad',
        bar:true
    })
}

export  {
    admin,
    create
}