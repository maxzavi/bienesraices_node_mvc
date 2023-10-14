import { Dropzone } from 'dropzone'


const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.image = {
    dictDefaultMessage:'Sube tus imágenes aquí!!',
    acceptedFiles: '.jpeg,.jpg,.png',
    maxFilessize: 5,
    maxFiles: 1,
    parallelUpload: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Quitar imagen',
    dictMaxFilesExceeded: 'El límite es una imágen',
    headers:{
        'CSRF-Token':token
    },
    paramName: 'image',
    init: function(){
        const dropzone = this
        const btnPublish = document.querySelector('#publish')

        btnPublish.addEventListener('click', function(){
            dropzone.processQueue()
        })

        dropzone.on('queuecomplete', function(){
            if(dropzone.getActiveFiles().length ==0){
                window.location.href = "/my-properties"
            }
        })
    }
}