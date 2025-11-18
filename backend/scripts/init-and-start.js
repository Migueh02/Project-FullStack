// Script que ejecuta setup y luego inicia el servidor
const { exec } = require('child_process');
const path = require('path');

console.log('🔧 Ejecutando setup de base de datos...');

// Ejecutar setup-db
exec('npm run setup-db', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
        console.error('⚠️ Setup tuvo errores:', error.message);
        // Continuar de todas formas
    }
    console.log(stdout);
    if (stderr) console.error(stderr);
    
    console.log('🚀 Iniciando servidor...');
    // Iniciar el servidor
    const serverProcess = exec('npm start', { cwd: path.join(__dirname, '..') });
    
    serverProcess.stdout.pipe(process.stdout);
    serverProcess.stderr.pipe(process.stderr);
    
    serverProcess.on('close', (code) => {
        process.exit(code);
    });
});
