import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import progressEstimator from 'progress-estimator';
import { globby } from 'globby';
import { performance } from 'perf_hooks';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const estimator = progressEstimator({ storagePath: join(__dirname, '.estimator') });

const getFileIcon = (filePath) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    return ext === 'js' ? '📄' : '📁';
};

(async () => {
    const startTime = performance.now();

    try {
        await estimator(
            execa('rimraf', ['dist']).then(() =>
                execa('tsc', [], { stdio: 'inherit' })
            ),
            'Building Your Express Application...'
        );

        const outputFiles = await globby(['dist/**/*'], { stats: true });

        console.info('\n✓ Transformed Files:');

        let totalSize = 0;

        outputFiles.forEach(({ path, stats }) => {
            const sizeInKB = (stats?.size || 0) / 1024;
            totalSize += sizeInKB;
            console.info(`${getFileIcon(path)} ${path} - ${sizeInKB.toFixed(2)} kB`);
        });

        const totalSizeInKB = totalSize.toFixed(2);
        const endTime = performance.now();
        const buildTime = ((endTime - startTime) / 1000).toFixed(2);

        console.info(`\n✓ Total Files: ${outputFiles.length}; Total Size: ${totalSizeInKB} kB`);
        console.info(`\n✓ Application was built in ${buildTime} seconds!`);
    } catch (error) {
        console.error('Build Failed:', error);
        process.exit(1);
    }
})();
