import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text } from 'ink';
import { theme } from '../semantic-colors.js';
import { formatDuration } from '../utils/formatters.js';
import { calculateAverageLatency, calculateCacheHitRate, calculateErrorRate, } from '../utils/computeStats.js';
import { useSessionStats } from '../contexts/SessionContext.js';
const METRIC_COL_WIDTH = 28;
const MODEL_COL_WIDTH = 22;
const StatRow = ({ title, values, isSubtle = false, isSection = false, }) => (_jsxs(Box, { children: [_jsx(Box, { width: METRIC_COL_WIDTH, children: _jsx(Text, { bold: isSection, color: isSection ? theme.text.primary : theme.text.link, children: isSubtle ? `  ↳ ${title}` : title }) }), values.map((value, index) => (_jsx(Box, { width: MODEL_COL_WIDTH, children: _jsx(Text, { color: theme.text.primary, children: value }) }, index)))] }));
export const ModelStatsDisplay = () => {
    const { stats } = useSessionStats();
    const { models } = stats.metrics;
    const activeModels = Object.entries(models).filter(([, metrics]) => metrics.api.totalRequests > 0);
    if (activeModels.length === 0) {
        return (_jsx(Box, { borderStyle: "round", borderColor: theme.border.default, paddingY: 1, paddingX: 2, children: _jsx(Text, { color: theme.text.primary, children: "No API calls have been made in this session." }) }));
    }
    const modelNames = activeModels.map(([name]) => name);
    const getModelValues = (getter) => activeModels.map(([, metrics]) => getter(metrics));
    const hasThoughts = activeModels.some(([, metrics]) => metrics.tokens.thoughts > 0);
    const hasTool = activeModels.some(([, metrics]) => metrics.tokens.tool > 0);
    const hasCached = activeModels.some(([, metrics]) => metrics.tokens.cached > 0);
    return (_jsxs(Box, { borderStyle: "round", borderColor: theme.border.default, flexDirection: "column", paddingY: 1, paddingX: 2, children: [_jsx(Text, { bold: true, color: theme.text.accent, children: "Model Stats For Nerds" }), _jsx(Box, { height: 1 }), _jsxs(Box, { children: [_jsx(Box, { width: METRIC_COL_WIDTH, children: _jsx(Text, { bold: true, color: theme.text.primary, children: "Metric" }) }), modelNames.map((name) => (_jsx(Box, { width: MODEL_COL_WIDTH, children: _jsx(Text, { bold: true, color: theme.text.primary, children: name }) }, name)))] }), _jsx(Box, { borderStyle: "single", borderBottom: true, borderTop: false, borderLeft: false, borderRight: false, borderColor: theme.border.default }), _jsx(StatRow, { title: "API", values: [], isSection: true }), _jsx(StatRow, { title: "Requests", values: getModelValues((m) => m.api.totalRequests.toLocaleString()) }), _jsx(StatRow, { title: "Errors", values: getModelValues((m) => {
                    const errorRate = calculateErrorRate(m);
                    return (_jsxs(Text, { color: m.api.totalErrors > 0 ? theme.status.error : theme.text.primary, children: [m.api.totalErrors.toLocaleString(), " (", errorRate.toFixed(1), "%)"] }));
                }) }), _jsx(StatRow, { title: "Avg Latency", values: getModelValues((m) => {
                    const avgLatency = calculateAverageLatency(m);
                    return formatDuration(avgLatency);
                }) }), _jsx(Box, { height: 1 }), _jsx(StatRow, { title: "Tokens", values: [], isSection: true }), _jsx(StatRow, { title: "Total", values: getModelValues((m) => (_jsx(Text, { color: theme.status.warning, children: m.tokens.total.toLocaleString() }))) }), _jsx(StatRow, { title: "Prompt", isSubtle: true, values: getModelValues((m) => m.tokens.prompt.toLocaleString()) }), hasCached && (_jsx(StatRow, { title: "Cached", isSubtle: true, values: getModelValues((m) => {
                    const cacheHitRate = calculateCacheHitRate(m);
                    return (_jsxs(Text, { color: theme.status.success, children: [m.tokens.cached.toLocaleString(), " (", cacheHitRate.toFixed(1), "%)"] }));
                }) })), hasThoughts && (_jsx(StatRow, { title: "Thoughts", isSubtle: true, values: getModelValues((m) => m.tokens.thoughts.toLocaleString()) })), hasTool && (_jsx(StatRow, { title: "Tool", isSubtle: true, values: getModelValues((m) => m.tokens.tool.toLocaleString()) })), _jsx(StatRow, { title: "Output", isSubtle: true, values: getModelValues((m) => m.tokens.candidates.toLocaleString()) })] }));
};
//# sourceMappingURL=ModelStatsDisplay.js.map