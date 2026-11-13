let web3, contract, account;
const $ = (id) => document.getElementById(id);

async function switchToGanache() {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x539" }], // 1337
    });
  } catch (err) {
    // 4902 = network not added yet, so add it
    if (err.code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x539",
          chainName: "Ganache Local",
          rpcUrls: ["http://127.0.0.1:7545"],
          nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
        }],
      });
    } else {
      throw err;
    }
  }
}

async function connect() {
  if (!window.ethereum) {
    $("status").innerText = "MetaMask not found in this browser.";
    return;
  }
  try {
    $("status").innerText = "Check the MetaMask popup...";
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];

    await switchToGanache();

    web3 = new Web3(window.ethereum);

    const artifact = await (await fetch("TaskManager.json")).json();
    const networkId = await web3.eth.net.getId();

    // Use the matching network entry, or fall back to the first deployment
    const deployed =
      artifact.networks[networkId] ||
      artifact.networks[5777] ||
      Object.values(artifact.networks)[0];

    if (!deployed) {
      $("status").innerText = "No deployment found in TaskManager.json. Run truffle migrate --reset and copy the file again.";
      return;
    }

    contract = new web3.eth.Contract(artifact.abi, deployed.address);
    $("account").innerText = account;
    $("contractAddr").innerText = deployed.address;
    $("status").innerText = "Connected ✅";
    await loadTasks();
  } catch (err) {
    console.error(err);
    $("status").innerText = "Error: " + (err.message || JSON.stringify(err));
  }
}

async function loadTasks() {
  const count = Number(await contract.methods.getTaskCount().call());
  $("count").innerText = count;
  const list = $("taskList");
  list.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const task = await contract.methods.getTask(i).call();
    const li = document.createElement("li");
    li.className = task[1] ? "done" : "";
    li.innerText = i + ". " + task[0] + (task[1] ? "  ✅" : "  ⏳") + "  ";

    const btn = document.createElement("button");
    btn.innerText = task[1] ? "Mark Pending" : "Mark Done";
    btn.addEventListener("click", () => toggleTask(i));
    li.appendChild(btn);

    list.appendChild(li);
  }
}

async function addTask() {
  const text = $("taskInput").value.trim();
  if (!text) return;
  try {
    $("status").innerText = "Waiting for confirmation...";
    await contract.methods.addTask(text).send({ from: account });
    $("status").innerText = "Task added ✅";
    $("taskInput").value = "";
    await loadTasks();
  } catch (err) {
    $("status").innerText = "Error: " + err.message;
  }
}

async function toggleTask(index) {
  try {
    $("status").innerText = "Waiting for confirmation...";
    await contract.methods.toggleTask(index).send({ from: account });
    $("status").innerText = "Task updated ✅";
    await loadTasks();
  } catch (err) {
    $("status").innerText = "Error: " + err.message;
  }
}

$("connectBtn").addEventListener("click", connect);
$("addBtn").addEventListener("click", () => contract && addTask());
$("refreshBtn").addEventListener("click", () => contract && loadTasks());