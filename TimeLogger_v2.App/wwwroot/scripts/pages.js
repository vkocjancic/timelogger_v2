import{LayoutDefaultComponent}from"./layout.js";let templateHome='<layout-default>    <h1 class="main__title">Daily logs</h1></layout-default>';export const HomeComponent={components:{"layout-default":LayoutDefaultComponent},template:templateHome};let templateInsights='<layout-default>    <h1 class="main__title">Insights</h1></layout-default>';export const InsightsComponent={components:{"layout-default":LayoutDefaultComponent},template:templateInsights};let templateTasks='<layout-default>    <h1 class="main__title">Task list</h1></layout-default>';export const TasksComponent={components:{"layout-default":LayoutDefaultComponent},template:templateTasks};let templateNotYetImplemented='<layout-default>    <h1 class="main__title">Under construction</h1>    <section class="main__content content__nyi">        <p>This page does not exist yet. Check back soon.</p>    </section></layout-default>';export const NotYetImplementedComponent={components:{"layout-default":LayoutDefaultComponent},template:templateNotYetImplemented};