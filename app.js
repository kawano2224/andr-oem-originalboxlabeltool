// ==========================
// 要素取得
// ==========================
const clientSelect = document.getElementById("client");
const clientOther = document.getElementById("clientOther");
const clientButtons = document.getElementById("clientButtons");
const addClient = document.getElementById("addClient");
const deleteClient = document.getElementById("deleteClient");

const productInput = document.getElementById("product");
const productSize = document.getElementById("productSize");
const janInput = document.getElementById("jan");

// プレビュー
const previewClient = document.getElementById("previewClient");
const previewProduct = document.getElementById("previewProduct");
const previewJan = document.getElementById("previewJan");

// ==========================
// Googleスプレッドシートからクライアント取得
// ==========================
const CLIENT_API_URL =
  "https://script.google.com/a/macros/and-r.co.jp/s/AKfycbz9yQZwJUgUDTcS9QfdoRtUi4UCThgyUaX0A_zziIfCmTghI_VtT_ZNVyDAoti8LnDD/exec";

async function loadClients() {
  try {
    const response = await fetch(
      `${CLIENT_API_URL}?t=${Date.now()}`
    );

    if (!response.ok) {
      throw new Error(`通信エラー: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(
        result.error || "クライアント取得に失敗しました"
      );
    }

    // プルダウンを一度空にする
    clientSelect.innerHTML =
      '<option value="">選択してください</option>';

    // スプレッドシートの内容を追加する
    result.clients.forEach(name => {
      const option = document.createElement("option");

      option.value = name;
      option.textContent = name;

      clientSelect.appendChild(option);
    });

    updateClient();

  } catch (error) {
    console.error("取得エラー:", error);
    alert(
      "クライアント一覧を取得できませんでした。\n" +
      error.message
    );
  }
}


const productInput = document.getElementById("product");
const productSize = document.getElementById("productSize");
const janInput = document.getElementById("jan");

// プレビュー
const previewClient = document.getElementById("previewClient");
const previewProduct = document.getElementById("previewProduct");
const previewJan = document.getElementById("previewJan");

// ここで実行
loadClients();

// ==========================
// クライアント名更新
// ==========================
function updateClient(){

    const other = document.getElementById("clientOther").value.trim();

    if(other !== ""){
        previewClient.textContent = other;
    }else{
        previewClient.textContent = clientSelect.value;
    }

}const clientButtons = document.getElementById("clientButtons");

clientOther.addEventListener("input", () => {

    if(clientOther.value.trim() === ""){

        clientButtons.classList.add("hidden");

        return;

    }


    // 新規入力中は追加ボタン表示
    clientButtons.classList.remove("hidden");

    addClient.style.display = "inline-block";
    deleteClient.style.display = "none";

});
document.getElementById("clientOther").addEventListener("input", updateClient);
// ==========================
// 商品名更新
// ==========================
function updateProduct() {

    previewProduct.textContent = productInput.value;

    updateProductSize();

}
// ==========================
// 商品名サイズ変更
// ==========================
function updateProductSize() {
    previewProduct.style.fontSize = productSize.value + "px";
}

// ==========================
// JAN更新
// ==========================
function updateJan() {

    previewJan.textContent = janInput.value;
    

}

// ==========================
// イベント
// ==========================
clientSelect.addEventListener("change", () => {

    if (clientSelect.value === "") {

        clientButtons.classList.add("hidden");

    } else {

        clientButtons.classList.remove("hidden");
        addClient.style.display = "none";
        deleteClient.style.display = "inline-block";

    }

    updateClient();

});

clientOther.addEventListener("input", updateClient);
productInput.addEventListener("input", updateProduct);
productSize.addEventListener("change", updateProductSize);

janInput.addEventListener("input", () => {

    // 数字以外を削除
    janInput.value = janInput.value.replace(/\D/g, "");

    // 13桁まで
    janInput.value = janInput.value.slice(0, 13);

    updateJan();

});

// 初期表示
updateClient();
updateProduct();
updateProductSize();
updateJan();


// 画像取得
const imageUpload = document.getElementById("imageUpload");
const previewImage = document.getElementById("previewImage");

const plusBtn = document.getElementById("imagePlus");
const minusBtn = document.getElementById("imageMinus");
const imageScaleSlider = document.getElementById("imageScaleSlider");
const scaleValue = document.getElementById("imageScaleText");

let imageScale = 100;

let imageX = 0;
let imageY = 0;


// 画像アップロード
imageUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;


    const reader = new FileReader();


    reader.onload = function(e){

        previewImage.onload = function(){

            imageScale = 100;
            imageX = 0;
            imageY = 0;

            changeImageTransform();

        };


        previewImage.src = e.target.result;

        previewImage.style.display = "block";

    };


    reader.readAsDataURL(file);

});

// サイズ変更
function changeImageTransform(){

    previewImage.style.transform =
    `
    translate(${imageX}px, ${imageY}px)
    scale(${imageScale / 100})
    `;


    scaleValue.textContent =
        imageScale + "%";

}


// ＋
plusBtn.addEventListener("click", ()=>{

    if(imageScale < 200){
        imageScale += 10;
    }

    changeImageTransform();

});


// −
minusBtn.addEventListener("click", ()=>{

    if(imageScale > 50){
        imageScale -= 10;
    }

    changeImageTransform();

});


// スライダー
imageScaleSlider.addEventListener("input", ()=>{

    imageScale = Number(imageScaleSlider.value);

    changeImageTransform();

});
const imageUp =
document.getElementById("imageUp");

const imageDown =
document.getElementById("imageDown");

const imageLeft =
document.getElementById("imageLeft");

const imageRight =
document.getElementById("imageRight");


imageUp.addEventListener("click",()=>{

    imageY -= 5;

    changeImageTransform();

});


imageDown.addEventListener("click",()=>{

    imageY += 5;

    changeImageTransform();

});


imageLeft.addEventListener("click",()=>{

    imageX -= 5;

    changeImageTransform();

});


imageRight.addEventListener("click",()=>{

    imageX += 5;

    changeImageTransform();

});

// ==========================
// クライアント追加
// ==========================
const addClient = document.getElementById("addClient");

addClient.addEventListener("click", async () => {
  const name = clientOther.value.trim();

  if (name === "") {
    return;
  }

  // 重複チェック
  for (const option of clientSelect.options) {
    if (option.value.trim() === name) {
      alert("すでに登録されています。");
      return;
    }
  }

  addClient.disabled = true;

  try {
    const response = await fetch(CLIENT_API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "add",
        name: name
      })
    });

    if (!response.ok) {
      throw new Error(`通信エラー: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "追加に失敗しました");
    }

    alert(`「${name}」を追加しました。`);

    // スプレッドシートから最新情報を読み直す
    location.reload();

  } catch (error) {
    console.error("追加エラー:", error);
    alert(`追加できませんでした。\n${error.message}`);

  } finally {
    addClient.disabled = false;
  }
});


// ==========================
// クライアント削除
// ==========================
const deleteClient = document.getElementById("deleteClient");

deleteClient.addEventListener("click", async () => {
  const selectedIndex = clientSelect.selectedIndex;

  if (selectedIndex < 0) {
    return;
  }

  const option = clientSelect.options[selectedIndex];
  const name = option.value.trim();

  // 空の初期選択肢は削除しない
  if (name === "") {
    return;
  }

  if (!confirm(`「${name}」を削除しますか？`)) {
    return;
  }

  deleteClient.disabled = true;

  try {
    const response = await fetch(CLIENT_API_URL, {
      method: "POST",
      body: JSON.stringify({
        action: "delete",
        name: name
      })
    });

    if (!response.ok) {
      throw new Error(`通信エラー: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "削除に失敗しました");
    }

    alert(`「${name}」を削除しました。`);

    location.reload();

  } catch (error) {
    console.error("削除エラー:", error);
    alert(`削除できませんでした。\n${error.message}`);

  } finally {
    deleteClient.disabled = false;
  }
});
// ==========================
// PDF出力
// ==========================

const pdfButton = document.getElementById("PDFbutton");

console.log(pdfButton);
console.log(imageUp);
console.log(imageDown);
console.log(imageLeft);
console.log(imageRight);
console.log(imageScaleSlider);
pdfButton.addEventListener("click", async ()=>{


    const preview = document.querySelector(".preview");


    // プレビューを画像化
const canvas = await html2canvas(preview, {

    scale:3,

    backgroundColor:"#ffffff",

    width: preview.offsetWidth,
    height: preview.offsetHeight

});


    const imgData = canvas.toDataURL("image/png");


    const { jsPDF } = window.jspdf;


    // W200mm × H210mm
    const pdf = new jsPDF({

        orientation:"portrait",

        unit:"mm",

        format:[200,210]

    });


const pdfWidth = 200;
const pdfHeight = 210;


// 比率を維持
const ratio = Math.min(
    pdfWidth / canvas.width,
    pdfHeight / canvas.height
);


const imgWidth = canvas.width * ratio;
const imgHeight = canvas.height * ratio;


const pdfX = (pdfWidth - imgWidth) / 2;
const pdfY = (pdfHeight - imgHeight) / 2;

    // ファイル名
    const now = new Date();

    const y =
        String(now.getFullYear()).slice(2);

    const m =
        String(now.getMonth()+1).padStart(2,"0");

    const d =
        String(now.getDate()).padStart(2,"0");


    const clientName =
        previewClient.textContent || "client";

    const productName =
        previewProduct.textContent || "product";
pdf.addImage(
    imgData,
    "PNG",
    pdfX,
    pdfY,
    imgWidth,
    imgHeight
);

pdf.save(
    `ダンボール表記_${clientName}-${productName}_${y}${m}${d}.pdf`
);

});
