import "./app/globals.css"
import "../styles/mobile.css"
import "@fontsource/roboto-mono/300.css"
import "@fontsource/roboto-mono/400.css"
import "@fontsource/roboto-mono/500.css"
import "@fontsource/roboto-mono/700.css"
import "@fontsource/dm-sans/300.css"
import "@fontsource/dm-sans/400.css"
import "@fontsource/dm-sans/500.css"
import "@fontsource/dm-sans/700.css"

import * as React from "react"
import * as ReactDOM from "react-dom/client"

import { HashRouter, Route, Routes } from "react-router-dom"

import HomePage from "./app/HomePage"
import ArnsPage from "./app/arns/ArnsPage"
import BlockPage from "./app/block/[slug]/BlockPage"
import BlocksPage from "./app/blocks/BlocksPage"
import EntityPage from "./app/entity/[slug]/EntityPage"
import { MessagePage } from "./app/message/[slug]/MessagePage"
import { ModulePage } from "./app/module/[slug]/ModulePage"
import ModulesPage from "./app/modules/ModulesPage"
import ProcessesPage from "./app/processes/ProcessesPage"

import { SwapPage } from "./app/swap/SwapPage"
import TokenPage from "./app/token/[slug]/TokenPage"
import RootLayoutUI from "./components/RootLayout/RootLayoutUI"
import { FourZeroFourPage } from "./pages/404"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HashRouter>
    <RootLayoutUI>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/message/:messageId" element={<MessagePage />} />
        <Route path="/blocks" element={<BlocksPage />} />
        <Route path="/block/:blockHeight" element={<BlockPage />} />
        <Route path="/modules" element={<ModulesPage />} />
        <Route path="/module/:moduleId" element={<ModulePage />} />
        <Route path="/processes" element={<ProcessesPage />} />
        <Route path="/entity/:entityId" element={<EntityPage />} />
        <Route path="/token/:tokenId" element={<TokenPage />} />
        <Route path="/arns" element={<ArnsPage />} />
        <Route path="/swap/:messageId" element={<SwapPage />} />
        <Route path="*" element={<FourZeroFourPage />} />
      </Routes>
    </RootLayoutUI>
  </HashRouter>,
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error)
  })
}
