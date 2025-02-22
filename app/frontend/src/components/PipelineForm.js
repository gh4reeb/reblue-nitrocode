import React, { useState } from 'react';
import axios from 'axios';

function PipelineForm() {
  const [jobName, setJobName] = useState('');
  const [status, setStatus] = useState('');

  const runPipeline = async () => {
    try {
      setStatus('Running...');
      await axios.post('/api/pipeline/run', { jobName });
      setStatus(`Pipeline ${jobName} triggered successfully.`);
    } catch (error) {
      setStatus('Error triggering pipeline.');
      console.error('Pipeline error:', error);
    }
  };

  return (
    <div>
      <h2>Run Pipeline</h2>
      <input
        type="text"
        placeholder="Enter Jenkins job name"
        value={jobName}
        onChange={(e) => setJobName(e.target.value)}
      />
      <button onClick={runPipeline}>Run</button>
      <p>{status}</p>
    </div>
  );
}

export default PipelineForm;
