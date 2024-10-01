const inputLimit = e => e.target.value = /^[0-9]*$/.test(e.target.value) ? Math.max(e.target.min, Math.min(e.target.max, +e.target.value)) : '';
(async () => {
    Key = "";
    Index = 0;
    Once = false;
    Temp = [];
    Page = {
        Home: {
            Node: [
                ["h2", { textContent: "# News" }]
            ],
            Dock: []
        },
        Item: {
            List: await (await fetch("https://dayx.vercel.app/items.json")).json(),
            Dock: [["input", { placeholder: "Search", oninput: e => document.querySelectorAll('#page > div > div').forEach(l => l.style.display = l.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ? 'flex' : 'none') }]],
            Form: data => [["img", { src: `assets/image/item_icon/${data[0]}.png` }], ["h5", { innerHTML: data[1] ? `ID: ${data[0]}<br>Name: ${data[1]}` : `ID: ${data[0]}` }], ["input", { placeholder: "Quantity", type: "number", min: 1, max: 1000000000, oninput: inputLimit }], ["button", { textContent: "Add Item" }], ["button", { textContent: "Add as Remove" }]]
        },
        Misc: {
            List: [
                ["addAlly", "", "", { min: 1, max: 100, customForm: data => [["h5", { textContent: data[0] }], ["select", ...[["raven", "Raven"], ["wolf", "Wolf"], ["pumpkin", "Lil Pum'kin"], ["polar_fox", "Polar Fox"], ["polar_bear", "Polar Bear"], ["emba_varan", "GeMCO"]].map(a => ["option", { value: a[0], textContent: a[1] }])], ["input", { placeholder: "Level", type: "number", min: data?.[3]?.min || 1, max: data?.[3]?.max || 90, oninput: inputLimit }], ["button", { textContent: "Add Ally" }]] }],
                ["pointPerk"], ["editCharacter"], ["editSetting"], ["offer_start"], ["exp_boost_time"], ["add_quest"], ["spend_caps"], ["add_caps"], ["set_caps"], ["quest_step"], ["bar_quest_step"], ["bar_quest_remove"], ["item_remove"], ["item_need"], ["addCurrency"], ["spendCurrency"], ["addWeather"], ["groupShopAB"], ["addMail"], ["season_stop"]
            ],
            Dock: [["input", { placeholder: "Search", oninput: e => document.querySelectorAll('#page > div > div').forEach(l => l.style.display = l.textContent.toLowerCase().includes(e.target.value.toLowerCase()) ? 'flex' : 'none') }]],
            Form: data => [["h5", { textContent: data[0] }]]
        },
        Data: {
            List: [],
            Dock: [["button", { textContent: "Reset Data" }], ["button", { textContent: "Create Promocode" }]],
            Form: data => [["h5", { textContent: data[0] }], ["input", { value: data[2].split("-").at(-1), type: "number", min: 1, max: 1000000000, oninput: inputLimit }], ["button", { textContent: "Edit Item Data" }], ["button", { textContent: "Remove Data" }]]
        },
        Code: {
            List: (await (await fetch("https://dxvrxv.vercel.app/api/promocode?code=*")).json()).map(c => [c.code, c.remain, atob(c.content)]).reverse(),
            Dock: [["button", { textContent: "Pre-Made Code" }], ["button", { textContent: "Refresh List" }]],
            Form: data => [["h5", { innerHTML: `Code: ${data[0]}<br>Remain: ${data[1]}` }], ["div", { innerHTML: data[2].split("|").join("<br>") }], ["button", { textContent: "Copy Code" }]]
        }
    };
    
    CreateElement(
        ["head", "meta", { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" }],
        ["head", "link", { href: "index.css", rel: "stylesheet" }],
        ["body", "main",
            ["div#page", ...Object.keys(Page).map(p => [`div#${p}`, ...(Page[p]?.Node || Page[p].List.map((v, i) => [`div#${p}-${i}`, { title: v[0], innerHTML: `${p != "Item" ? "" : `<img src="assets/image/item_icon/${v[0]}.png" width="44" height="44" loading="lazy">`}<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }]))]), {
                onclick: e => {
                    const element = e.target.closest("[title]");
                    if (!element) return;
                    const [key, index] = element.id.split("-");
                    UpdateElement(["#form", { innerHTML: "", style: { display: "flex" } }, ["div", ...(Page[key].List[index]?.[3]?.customForm ? Page[key].List[index]?.[3]?.customForm(Page[key].List[index]) : (Page[key].Form(Page[key].List[index]) || []))]]);
                    Key = key;
                    Index = index;
                    Temp = Page[key].List[index];
                }
            }],
            ["div#form", {
                onclick: e => {
                    if (e.target.id == "form") e.target.style.display = "none";
                    if (e.target.textContent == "Add Item") {
                        Page.Data.List.push([Temp[0], Temp[1], `${Temp[0]}-${e.target.previousSibling.value || "1"}`]);
                        UpdateElement(["#form", { style: { display: "none" } }], ["#Data", { innerHTML: "" }, ...Page.Data.List.map((v, i) => [`div#Data-${i}`, { title: v[0], innerHTML: `<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }])]);
                    } else if (e.target.textContent == "Add as Remove") {
                        Page.Data.List.push([Temp[0], Temp[1], `item_remove-${Temp[0]}`, { customForm: data => [["h5", { textContent: data[0] }], ["button", { textContent: "Remove Data" }]] }]);
                        UpdateElement(["#form", { style: { display: "none" } }], ["#Data", { innerHTML: "" }, ...Page.Data.List.map((v, i) => [`div#Data-${i}`, { title: v[0], innerHTML: `<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }])]);
                    } else if (e.target.textContent == "Add Ally") {
                        Page.Data.List.push([Temp[0], Temp[1], `${Temp[0]}-${e.target.previousSibling.previousSibling.value}-${e.target.previousSibling.value}`, { min: 1, max: 100, customForm: data => [["h5", { textContent: data[0] }], ["select", ...[["raven", "Raven"], ["wolf", "Wolf"], ["pumpkin", "Lil Pum'kin"], ["polar_fox", "Polar Fox"], ["polar_bear", "Polar Bear"], ["emba_varan", "GeMCO"]].map(a => ["option", { value: a[0], textContent: a[1], selected: a[0] == data[2].split("-")[1] }])], ["input", { value: data[2].split("-")[2], type: "number", min: 1, max: 100, oninput: inputLimit }], ["button", { textContent: "Edit Ally Data" }], ["button", { textContent: "Remove Data" }]] }]);
                        UpdateElement(["#form", { style: { display: "none" } }], ["#Data", { innerHTML: "" }, ...Page.Data.List.map((v, i) => [`div#Data-${i}`, { title: v[0], innerHTML: `<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }])]);
                    } else if (e.target.textContent == "Edit Item Data") {
                        Page[Key].List[Index][2] = `${Temp[0]}-${e.target.previousSibling.value || "1"}`;
                        UpdateElement(["#form", { style: { display: "none" } }], ["#Data", { innerHTML: "" }, ...Page.Data.List.map((v, i) => [`div#Data-${i}`, { title: v[0], innerHTML: `<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }])]);
                    } else if (e.target.textContent == "Edit Ally Data") {
                        Page[Key].List[Index][1] = ([["raven", "Raven"], ["wolf", "Wolf"], ["pumpkin", "Lil Pum'kin"], ["polar_fox", "Polar Fox"], ["polar_bear", "Polar Bear"], ["emba_varan", "GeMCO"]].find(x => x[0] === e.target.previousSibling.previousSibling.value) || [])[1];
                        Page[Key].List[Index][2] = `${Temp[0]}-${e.target.previousSibling.previousSibling.value}-${e.target.previousSibling.value || "1"}`;
                        UpdateElement(["#form", { style: { display: "none" } }], ["#Data", { innerHTML: "" }, ...Page.Data.List.map((v, i) => [`div#Data-${i}`, { title: v[0], innerHTML: `<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }])]);
                    } else if (e.target.textContent == "Remove Data") {
                        delete Page[Key].List[Index];
                        Page[Key].List.filter(Boolean);
                        UpdateElement(["#form", { style: { display: "none" } }], ["#Data", { innerHTML: "" }, ...Page.Data.List.map((v, i) => [`div#Data-${i}`, { title: v[0], innerHTML: `<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }])]);
                    } else if (e.target.textContent == "Copy Code") {
                        prompt("Code: ", Temp[0]);
                    } else if (e.target.textContent == "Create") {
                        if (Page.Data.List == 0) return;
                        const code = e.target.previousSibling.previousSibling.value;
                        const remain = e.target.previousSibling.value || "1";
                        if (code && !Once) {
                            Once = true
                            const body = "setdata=" + btoa(JSON.stringify({ code, content: btoa(Page.Data.List.map(l => l[2]).join('|')), remain }));
                            fetch("https://dxvrxv.vercel.app/api/promocode", { method: "POST", body }).then(res => res.text()).then(res => {
                                if (res == "code already exists") {alert("Code already exists"); Once = false}
                                else if (res == "code has created") {
                                    Page.Code.List.unshift([code, remain, Page.Data.List.map(l => l[2]).join("|")]);
                                    UpdateElement(["#form", { style: { display: "none" } }], ["#Code", { innerHTML: "" }, ...Page.Code.List.map((v, i) => [`div#Code-${i}`, { title: v[0], innerHTML: `<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }])]);
                                    Once = false;
                                }
                                else {alert("Server error"); Once = false};
                            });
                        }
                    }
                }
            }],
            ["div#dock", {
                onclick: e => {
                    if (e.target.textContent == "Reset Data") {
                        if (Page.Data.List.length == 0 || !confirm("Confirm")) return;
                        Page.Data.List = [];
                        UpdateElement(["#Data", { innerHTML: "" }, ...Page.Data.List.map((v, i) => [`div#Data-${i}`, { title: v[0], innerHTML: `<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }])]);
                    } else if (e.target.textContent == "Create Promocode") {
                        if (Page.Data.List.length == 0) return;
                        UpdateElement(["#form", { style: { display: "flex" }, innerHTML: "" }, ["div", ["h5", { innerHTML: "Promocode" }], ["input", { placeholder: "Code", oninput: e => e.target.value = e.target.value.replace(/\s/g, '') }], ["input", { placeholder: "Max Use", type: "number", min: 1, max: 20, oninput: inputLimit }], ["button", { textContent: "Create" }]]])
                    } else if (e.target.textContent == "Refresh List") {
                        if (Once) return; Once = true;
                        fetch("https://dxvrxv.vercel.app/api/promocode?code=*").then(res => res.json()).then(res => { Page.Code.List = []; res.reverse().forEach(r => Page.Code.List.push([r.code, r.remain.toString(), atob(r.content)])); UpdateElement(["#Code", { innerHTML: "" }, ...Page.Code.List.map((v, i) => [`div#Code-${i}`, { title: v[0], innerHTML: `<span><h5>${v[1] ? `${v[0]} -> ${v[1]}` : v[0]}</h5>${v[2] ? `<h6>${v[2]}</h6>` : ""}</span>` }])]); alert("Code refreshed"); Once = false });
                    }
                }
            }],
            ["div#navi", ...Object.keys(Page).map(p => [`button#nav-${p}`, { textContent: p }]), {
                onclick: e => {
                    [...document.getElementById("navi").children].forEach(c => c.className = (c == e.target ? "active" : ""));
                    [...document.getElementById("page").children].forEach(c => c.style.display = (`nav-${c.id}` == e.target.id ? "block" : "none"));
                    document.querySelectorAll('#page > div > div').forEach(l => l.style.display = 'flex');
                    UpdateElement(["#dock", { innerHTML: "" }, ...Page[e.target.textContent].Dock]);
                }
            }]
        ]
    );
})();
