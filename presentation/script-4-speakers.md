# Blockchain in the Oil & Gas Industry — Script for 4 Speakers

CGEB4112 Energy and Computing · Assignment 2 · Group 10

The wording is the same as `script.md`; only the speakers changed.
`▸` = press Next (→, Space or the clicker), then say the line.

| Speaker | Parts | Scenes | Presses | Time |
|---|---|---|---|---|
| Speaker 1 | A + B | 1–5 | 20 | ≈ 2:30 |
| Speaker 2 | C + D | 6–9 | 17 | ≈ 2:10 |
| Speaker 3 | E | 10–12 | 13 | ≈ 1:45 |
| Speaker 4 | F | 13–15 | 16 | ≈ 1:45 |
| **Total** | | **15** | **66** | **≈ 8:10 + handovers** |

Handover tip: the next speaker takes the clicker after the last line of the previous speaker. The next press opens their first scene.

---

## SPEAKER 1 — The hook, the oil business and the problem
*Scenes 1–5 · ≈ 2:30*

### Part A · The hook and the oil business
### Scene 1 — The hook
▸ This is an oil tanker.
▸ A large one can carry up to **two million barrels** of crude oil — a cargo worth more than a **hundred million dollars**.
▸ But the deal behind this cargo still runs on **emails, PDFs and paper**.
▸ Today we'll show how blockchain is changing that.

### Scene 2 — Title and roadmap
▸ We are Group 10, and our topic is **Blockchain in the Oil and Gas industry**.
▸ We'll start with how the oil business works, then explain blockchain, see where it's used, walk through a **real platform**, and finish with the **challenges and benefits**.

### Scene 3 — The value chain
▸ First, the basics. The oil industry has **three stages**.
▸ **Upstream** is about finding oil and getting it out of the ground — exploration, drilling and production.
▸ **Midstream** moves and stores it — pipelines, tankers and storage terminals.
▸ **Downstream** turns crude oil into products we use every day — petrol, diesel and jet fuel — and sells them.
▸ A company like Petronas works in all three.

### Part B · How oil is traded, and the problem
### Scene 4 — Many hands on one cargo
▸ Between these stages, oil is **bought and sold many times**.
▸ One cargo has a seller and a buyer…
▸ …a bank that pays for it, a shipping company that moves it, an inspector who checks its quality, and a terminal that stores it.
▸ And every one of them keeps **its own records**, in its own system.

### Scene 5 — The paper problem
▸ So the same deal is typed, checked and re-checked **again and again**.
▸ The key documents — the contract, the **bill of lading**, which proves who owns the cargo, and the bank's **letter of credit** — still travel by email or courier.
▸ This is **slow**, it causes **mistakes**, and it opens the door to **fraud**.
▸ In 2020, the Singapore oil trader **Hin Leong** collapsed owing about **3.5 billion US dollars** to 23 banks. Investigators found forged documents, and some cargoes had been used to borrow money **more than once**.
▸ The real problem is simple: there is **no single version of the truth** that everyone can trust.


*(Handover → Speaker 2)*

---

## SPEAKER 2 — What blockchain is and where it is used
*Scenes 6–9 · ≈ 2:10*

### Part C · What blockchain is
### Scene 6 — A shared record book
▸ This is exactly the kind of problem blockchain was built for.
▸ A blockchain is a **shared digital record book**. Instead of each company keeping its own copy, everyone in the network holds **the same copy**.
▸ New records are grouped into **blocks**. Each block is linked to the one before it by a unique digital fingerprint, called a **hash**.
▸ If someone tries to change an old record, the fingerprint no longer matches — and **the whole network sees it**.
▸ So the history can be added to, but **not secretly changed**.

### Scene 7 — Private blockchains and smart contracts
▸ Bitcoin uses a **public** blockchain — anyone can join.
▸ Energy companies use **private**, or permissioned, blockchains. Only approved members can join, and each company sees only the deals it's part of.
▸ Many also use **smart contracts** — small programs that run a rule automatically. For example: **if** the cargo arrives and passes inspection, **then** release the payment.

### Part D · Where it is used in the industry
### Scene 8 — Across the value chain
▸ So where is blockchain used today? Let's go back to our three stages.
▸ **Upstream**: paying suppliers with smart contracts. In one pilot, a group of ten oil companies — including Chevron, ExxonMobil and Shell — tracked trucks hauling water from oil wells and settled the bills automatically, using a platform called **GumboNet**.
▸ **Midstream**: recording every handover as oil moves through pipelines, ships and storage — once, for everyone.
▸ **Downstream and trading**: confirming deals, sharing shipping documents and getting bank finance — all digitally.
▸ It can even track **where fuel came from** and its **carbon footprint**.

### Scene 9 — When does it make sense?
▸ But blockchain is not the answer to everything. It makes sense when…
▸ …**many companies** share the same data,
▸ …they **don't fully trust** each other,
▸ …and mistakes or fraud are **expensive**. Oil trading ticks all three boxes.


*(Handover → Speaker 3)*

---

## SPEAKER 3 — A real example: VAKT
*Scenes 10–12 · ≈ 1:45*

### Part E · A real example: VAKT
### Scene 10 — Meet VAKT
▸ Now a real example: **VAKT**.
▸ VAKT is a London-based platform for everything that happens **after** an oil deal is agreed — what the industry calls **post-trade**.
▸ It was set up by **BP, Shell and Equinor**, together with traders and banks, and went live in **2018** — starting with North Sea crude, the oil behind the **Brent** price.
▸ Chevron, Total and Reliance joined soon after, and in 2020 **Saudi Aramco** invested 5 million dollars.

### Scene 11 — How a deal works on VAKT
▸ Here's how a deal works.
▸ **Step one**: a seller and a buyer agree a trade, and each enters it into the platform.
▸ **Step two**: VAKT matches both sides. If anything is different, it's flagged right away — no long email chains.
▸ **Step three**: shipping details and the inspector's quality report are added to **the same record**.
▸ **Step four**: the bank sees the same verified data and can finance the cargo. VAKT connects to **komgo**, a blockchain platform for trade finance set up by major banks and traders.
▸ Under the hood, VAKT runs on **Quorum** — a private version of Ethereum, first built by JPMorgan. Only the companies in a deal can see its details.

### Scene 12 — The result
▸ The result: **one shared record** instead of many separate copies.
▸ Soon after launch, VAKT's users covered about **two-thirds** of North Sea oil deals.
▸ And it's still in use — in 2024, **Shell Trading Rotterdam** adopted its vSure product to digitise contracts.


*(Handover → Speaker 4)*

---

## SPEAKER 4 — Challenges, benefits and conclusion
*Scenes 13–15 · ≈ 1:45*

### Part F · Challenges, benefits and conclusion
### Scene 13 — Implementation challenges
▸ Still, blockchain is not easy to put in place.
▸ **One — adoption.** It only works if everyone joins. A shared record book is useless if half the market stays on paper.
▸ **Two — integration.** Companies already have trading and accounting systems, and connecting them costs time and money.
▸ **Three — law and standards.** Not every country accepts digital documents, like an electronic bill of lading, yet.
▸ **Four — privacy.** Competitors don't want rivals to see their prices.
▸ **Five — garbage in, garbage out.** Blockchain stops records from being changed, but it can't check that the data was true when it was entered.

### Scene 14 — Advantages
▸ But when it works, the benefits are clear.
▸ **One shared truth** — no more checking the same deal again and again.
▸ **Speed** — documents move in minutes, not days.
▸ **Less fraud** — it's much harder to use the same cargo twice.
▸ **A full audit trail** — every step is recorded, with a time and an owner.
▸ **Automation** — smart contracts handle approvals and payments by themselves.

### Scene 15 — Conclusion
▸ To sum up: oil passes through many hands, and every hand keeps its own records.
▸ Blockchain gives them **one shared record** that nobody can secretly change.
▸ It's not perfect yet, but platforms like **VAKT** show it already works in the real market.
▸ Thank you — we're happy to take your questions.
