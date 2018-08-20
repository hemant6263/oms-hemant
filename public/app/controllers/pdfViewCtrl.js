angular.module('userApp')
    .controller('pdfViewCtrl', function(SharedScope) {
        var vm = this;
        vm.fileName = '/file/'+ SharedScope.getData();

        vm.init = function() {
            vm.renderPDF(vm.fileName, document.getElementById('pdf-holder'));
        }

        vm.renderPDF = function(fileURL, canvasContainer) {
            var scale = 1.5; //"zoom" factor for the PDF
           PDFJS.workerSrc = 'app/views/assets/js/pdf.worker.js';

            function renderPage(page) {
                var viewport = page.getViewport(scale);
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };

                canvas.height = viewport.height;
                canvas.width = viewport.width;

                canvasContainer.appendChild(canvas);

                page.render(renderContext);
            }

            function renderPages(pdfDoc) {
                for (var num = 1; num <= pdfDoc.numPages; num++)
                    pdfDoc.getPage(num).then(renderPage);
            }

            // PDFJS.disableWorker = true;
            PDFJS.getDocument(fileURL).then(renderPages);

        }

        vm.init();
    });
