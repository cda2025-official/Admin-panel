function setLoading() {
    var compress_pdf = document.getElementById("compress_pdf");
    if (compress_pdf.style.animation == "none") {
      console.log("Loading...");
    } else {
      compress_pdf.style.animation = "loading 2s infinite";
    }
    compress_pdf.innerText = "Compressing...";
    compress_pdf.disabled = true;
  }

  function resetLoading() {
    var compress_pdf = document.getElementById("compress_pdf");
    compress_pdf.style.animation = "none";
    compress_pdf.disabled = false;
    compress_pdf.innerText = "Compress PDF";
  }

  function onPDFCompressed() {
    var pdf_input = document.getElementById("pdf_input");
    pdf_input.value = "";
    resetAll();
  }

  function resetAll() {
    resetTempArrays();
    //clearPDFList();
    resetLoading();
  }

  function addFileEntry(file_name) {
    var list = document.getElementById("selected_pdf_list");
    var entry = document.createElement("li");
    entry.style = "list-style: none; font-size: x-small;";
    var img = new Image();
    img.classList.add("handle");
    entry.append(img);
    var space = document.createTextNode("\u00A0");
    entry.append(space);
    entry.append(file_name);
    list.appendChild(entry);
  }

  var selected_pdf_list = document.getElementById("selected_pdf_list");
  var sortable_list = new Sortable(selected_pdf_list, {
    animation: 150,
    ghostClass: "ghost-class",
    onSort: function (event) {
      updateFileListOnSort(event.to);
    },
  });

  var tenet = [];
  var fc = 0;

  var input_file_names = [];
  var ordered_input_files = [];
  var ordered_index = [];
  var sorted = false;

  var input_scale = 1,
    input_quality = 0.5,
    input_quality_ui = 0.5,
    input_format = "image/jpeg";

  var pdf_input = document.getElementById("pdf_input");
  pdf_input.addEventListener("input", onInputPDF);

  var compress_pdf = document.getElementById("compress_pdf");
  compress_pdf.addEventListener("click", onProcessInputPDF);

  var quality_input = document.getElementById("compress_input");
  quality_input.addEventListener("input", onQualityInput);

  // var tenet_pdf = document.getElementById("tenet");
  // tenet_pdf.addEventListener("click", processImageData);

  function onQualityInput() {
    input_quality_ui = Number(this.value);
    var output_quality = document.getElementById("compress_input_output");
    // output_quality.value = input_quality_ui;
    output_quality.innerText = input_quality_ui;
    input_quality = 1 - input_quality_ui;
  }

  function resetTempArrays() {
    input_file_names = [];
    ordered_input_files = [];
    ordered_index = [];
    sorted_file_names = [];
    tenet = [];
    sorted = false;
  }

  function onInputPDF() {
    resetTempArrays();
    clearPDFList();

    fc = this.files.length;

    for (i = 0; i < fc; i++) {
      var file = this.files[i];

      if (!file) {
        return;
      }

      if (file.type != "application/pdf") {
        pdfName = null;
        pdfFileObject = null;
        console.log(
          file.name + " - Unsupported file format, Select a PDF file!!"
        );
        selected_file_name = file.name + " - Unsupported file format!!";
        alert(selected_file_name);
        return;
      }
    }

    ordered_input_files = Array.from(this.files);

    for (j = 0; j < fc; j++) {
      input_file_names.push(this.files[j]["name"]);
    }

    // console.log(ordered_input_files);
    generateFileList();
  }

  function generateFileList() {
    for (i = 0; i < ordered_input_files.length; i++) {
      addFileEntry(ordered_input_files[i]["name"]);
    }
  }

  function compareFileLists(oldList, newList) {
    var indexList = [];
    var i = 0,
      len = oldList.length;
    while (i < len) {
      indexList.push(newList.indexOf(oldList[i]));
      i++;
    }

    return indexList;
  }

  function sortFiles(fileListRef, sortedIndex) {
    var fileList = Array.from(fileListRef);
    var i = 0;
    len = sortedIndex.length;

    while (i < len) {
      while (sortedIndex[i] != i) {
        var currTgtIdx = sortedIndex[sortedIndex[i]];
        var currTgtData = fileList[sortedIndex[i]];

        sortedIndex[sortedIndex[i]] = sortedIndex[i];
        fileList[sortedIndex[i]] = fileList[i];

        sortedIndex[i] = currTgtIdx;
        fileList[i] = currTgtData;
      }
      i++;
    }
    return fileList;
  }

  function updateFileListOnSort(file_list_div) {
    sorted_file_names = [];
    var items = file_list_div.childNodes;
    for (i = 0; i < items.length; i++) {
      sorted_file_names.push(items[i].textContent.trim());
    }

    var finalIndex = compareFileLists(input_file_names, sorted_file_names);
    // ordered_input_files = sortFiles(ordered_input_files, finalIndex);
    ordered_index = Array.from(finalIndex);
    // console.log(ordered_index);
  }

  function clearPDFList() {
    var list = document.getElementById("selected_pdf_list");
    list.textContent = "";
  }

  function generateMetadata(file) {
    pdfName = file["name"];
    pdfFileObject = file;
    selected_file_name = pdfName;
  }

  function getFileToProcessed() {
    return ordered_input_files.shift();
  }

  function checkFileProcessProgress() {
    if (ordered_input_files.length == 0) {
      processImageData();
    } else {
      onProcessInputPDF();
    }
  }

  function checkFiles() {
    return ordered_input_files.length;
  }

  function sortFileList() {
    if (!sorted) {
      var sorted_files = sortFiles(ordered_input_files, ordered_index);
      // console.log(sorted_files);
      ordered_input_files = Array.from(sorted_files);
      sorted = true;
    }
  }

  function onProcessInputPDF() {
    if (!checkFiles()) {
      alert("Select PDF Files to Compress 🙂");
      return;
    }

    setLoading();

    sortFileList();

    // console.log(ordered_input_files);

    var file = getFileToProcessed();

    if (file) {
      generateMetadata(file);
    } else {
      return;
    }

    if (!pdfFileObject) {
      return;
    }

    console.log("Loading selected file: " + pdfName);

    const reader = new FileReader();

    reader.onload = function (e) {
      var url = e.target.result;
      pdf2img(url);
    };
    if (pdfFileObject) {
      reader.readAsDataURL(pdfFileObject);
    } else {
      console.log(
        "Error reading file: " + pdfName + " Choose file(s) again..."
      );
    }
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc = "js/pdf.worker.min-2.5.207.js";

  var pdfDoc = null,
    pageNum = 1,
    pdfFileObject = null,
    pageRendering = false,
    pageCount = 0,
    pageNumPending = null,
    pageScale = input_scale,
    pageQuality = input_quality,
    pageQualityUI = input_quality_ui,
    pageFormat = input_format,
    imgData = null,
    pdfName = "doc",
    selected_file_name = "";

  var canvas = document.getElementById("page_canvas");
  var ctx = canvas.getContext("2d");

  function pdf2img(pdf_url) {
    readPDF(pdf_url).then(
      () => downloadAll(),
      () => {
        console.log("Error reading PDF... May be an encrypted one [-_^]");
      }
    );
  }

  function readPDF(url) {
    return new Promise((resolve, reject) => {
      var loadingTask = pdfjsLib.getDocument(url);
      loadingTask.promise.then(
        function (pdfDoc_) {
          pdfDoc = pdfDoc_;
          resetPDFMetaStore(pdfDoc.numPages);
          console.log("PDF Loaded: " + pdfName);
          selected_file_name += " - " + pageCount + " Pages";
          resolve(1);
        },
        () => reject(1)
      );
    });
  }

  function resetPDFMetaStore(numPages) {
    pageCount = numPages;
    imgData = {};
    pageNumPending = [];
    pageScale = input_scale;
    pageQuality = input_quality;
    pageQualityUI = input_quality_ui;
    pageFormat = input_format;
  }

  function getOutputPdfName() {
    if (fc == 1) {
      return pdfName.split(".pdf")[0] + "_min_" + pageQualityUI + ".pdf";
    } else {
      return "Comb_Doc" + "_min_" + pageQualityUI + ".pdf";
    }
  }

  /**
   * Get page info from document, resize canvas accordingly, and render page.
   * @param num Page number.
   */
  function renderPage(num) {
    pageRendering = true;
    // Using promise to fetch the page
    pdfDoc.getPage(num).then(function (page) {
      var viewport = page.getViewport({
        scale: pageScale
      });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Render PDF page into canvas context
      var renderContext = {
        canvasContext: ctx,
        viewport: viewport,
      };
      var renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(function () {
        data = canvas.toDataURL(pageFormat, pageQuality);

        imgData[num] = data;
        console.log("Completed page: " + num);
        pageRendering = false;

        if (pageNumPending !== null && pageNumPending.length != 0) {
          // New page rendering is pending
          renderPage(pageNumPending.shift());
        } else {
          if (Object.keys(imgData).length == pageCount) {
            tenet.push(JSON.parse(JSON.stringify(imgData)));
            console.log("Rendering complete");
            checkFileProcessProgress();
            //processImageData();
          }
        }
      });
    });

    console.log("Processing page: " + num);
  }

  /**
   * If another page rendering in progress, waits until the rendering is
   * finised. Otherwise, executes rendering immediately.
   */
  function queueRenderPage(num) {
    if (pageRendering) {
      pageNumPending.push(num);
    } else {
      renderPage(num);
    }
  }

  function downloadAll() {
    for (i = 1; i <= pageCount; i++) {
      queueRenderPage(i);
    }
  }

  function getImgObj(data) {
    return new Promise(function (resolve, reject) {
      var img = new Image();
      img.onload = function () {
        resolve(img);
      };
      img.src = data;
    });
  }

  async function processImageData() {
    var options = {
      autoFirstPage: false,
      compress: false,
    };

    const doc = new PDFDocument(options);

    doc.info = {
      Title: "ImageDoc.pdf",
      Author: "Img2Pdf",
      Keywords: "https://opentoolkit.github.io/Img2Pdf/",
    };
    const stream = doc.pipe(blobStream());

    for (let k = 0; k < tenet.length; k++) {
      var imgData = tenet[k];
      console.log("PDF %d: %d pages", k + 1, Object.keys(imgData).length);

      for (let i = 1; i <= Object.keys(imgData).length; i++) {
        img_data = await getImgObj(imgData[i]);
        doc.addPage({
          size: [img_data.width, img_data.height],
        });
        doc.image(img_data.src, 0, 0);
      }
    }

    doc.end();

    stream.on("finish", function () {
      var output_blob = stream.toBlob("application/pdf");
      saveAs(output_blob, getOutputPdfName());
      onPDFCompressed();
    });
  }