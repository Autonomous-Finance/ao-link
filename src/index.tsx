import "./app/globals.css"
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

import BlockPage from "./app/block/[slug]/page"
import BlocksPage from "./app/blocks/page"
import EntityPage from "./app/entity/[slug]/page"
import { MessagePage } from "./app/message/[slug]/MessagePage"
import { ModulePage } from "./app/module/[slug]/ModulePage"
import ModulesPage from "./app/modules/page"
import HomePage from "./app/page"
import ProcessesPage from "./app/processes/page"

import TokenPage from "./app/token/[slug]/TokenPage"
import RootLayoutUI from "./components/RootLayout/RootLayoutUI"

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
      </Routes>
    </RootLayoutUI>
  </HashRouter>,
)
